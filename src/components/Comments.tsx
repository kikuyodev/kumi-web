import { For, Show, createEffect, createSignal } from "solid-js";
import { TextBox } from "./controls/TextBox";
import { useAccount } from "../contexts/AccountContext";
import { ApiComment } from "../structures/api/ApiComment";
import { Util } from "../util/Util";
import "../styles/components/comments.scss";

export interface CommentMeta {
    can_pin: boolean;
    comments: {
        can_edit: boolean;
        can_delete: boolean;
    }[]
}

export interface CommentActions {
    createComment: (message: string, parent?: ApiComment) => void;
    editComment: (comment: ApiComment, message: string) => void;
    deleteComment: (comment: ApiComment) => void;
    pinComment: (comment: ApiComment) => void;
}

export function Comments(props: {
    comments?: ApiComment[],
    meta?: CommentMeta,
    actions: CommentActions
}) {
    const account = useAccount();
    const [comments, setComments] = createSignal<ApiComment[]>([]);
    const [pinnedComments, setPinnedComments] = createSignal<ApiComment[]>([]);

    let textbox: HTMLInputElement | undefined = undefined;

    createEffect(() => {
        setPinnedComments(props.comments?.filter(x => x.pinned).sort((a, b) => {
            return (b.created_at ? new Date(b.created_at).getTime() : 0) - (a.created_at ? new Date(a.created_at).getTime() : 0);
        }) ?? []);

        setComments(props.comments?.filter(x => !x.pinned).sort((a, b) => {
            return (b.created_at ? new Date(b.created_at).getTime() : 0) - (a.created_at ? new Date(a.created_at).getTime() : 0);
        }) ?? []);
    });

    return <div class="comments">
        <div class="comments--header">
            <h1>COMMENTS</h1>
            <p>•</p>
            <p>{props.comments?.length}</p>
        </div>
        <Show when={pinnedComments().length > 0}>
            <div class="comments--pinned">
                <For each={pinnedComments()}>
                    {comment => <CommentThread comment={comment} meta={props.meta} actions={props.actions} />}
                </For>
            </div>
        </Show>
        <Show when={account.isLoggedIn()}>
            <div class="comments--form">
                <TextBox ref={textbox} placeholder="Write a comment...">
                    <div class="comments--form-buttons">
                        <div class="comments--form-buttons-right">
                            <button class="comments--form-buttons-right-post" onClick={() => {
                                if (props.actions.createComment && textbox?.value) {
                                    props.actions.createComment(textbox.value);
                                    textbox.value = "";
                                }
                            }}>Post</button>
                        </div>
                    </div>
                </TextBox>
                <p>Commenting as <a href={`/accounts/${account.apiAccount!.id}`}>{account.apiAccount!.username}</a></p>
            </div>
        </Show>
        <div class="comments--list">
            <For each={comments()}>
                {comment => <CommentThread comment={comment} meta={props.meta} actions={props.actions} />}
            </For>
        </div>
    </div>;
}

function CommentThread(props: {
    comment: ApiComment,
    parent?: ApiComment,
    meta?: CommentMeta,
    depth?: number,
    actions: CommentActions
}) {
    return (
        <div class="comments--thread">
            <Comment depth={props.depth ?? 0} parent={props.parent} comment={props.comment} meta={{
                canPin: props.meta?.can_pin ?? false,
                canEdit: props.meta?.comments[props.comment.id].can_edit ?? false,
                canDelete: props.meta?.comments[props.comment.id].can_delete ?? false,
            }} actions={props.actions} />

            <For each={props.comment.children}>
                {child => <CommentThread parent={props.comment} comment={child} meta={props.meta} depth={(props.depth ?? 0) + 1} actions={props.actions} />}
            </For>
        </div>
    );
}

function Comment(props: {
    comment: ApiComment,
    depth: number,
    parent?: ApiComment,
    meta: {
        canPin: boolean,
        canEdit: boolean,
        canDelete: boolean,
    },
    actions: CommentActions
}) {
    const [editing, setEditing] = createSignal(false);
    const [replying, setReplying] = createSignal(false);

    let textbox: HTMLInputElement | undefined = undefined;

    return <div class="comments--list-comment" style={{
        "margin-left": `${props.depth * 64}px`
    }}>
        <div class="comments--list-comment-content">
            <img src={Util.getCdnFor("avatars", props.comment.author.id)} alt="avatar" />
            <div class="comments--list-comment-content-body">
                <div class="comments--list-comment-content-body-username">
                    <a href={`/accounts/${props.comment.author.id}`}>{props.comment.author.username}</a>
                    <p>• {Util.getRelativeTimeString(new Date(props.comment.created_at!))}</p>
                    <Show when={props.comment.pinned}>
                        <p>(Pinned)</p>
                    </Show>
                    <Show when={props.parent}>
                        <p>{"»"} {props.parent?.author.username}</p>
                    </Show>
                </div>
                <Show when={!props.comment.deleted}>
                    <div class="comments--list-comment-content-body-content">
                        <Show when={editing()}>
                            <TextBox ref={textbox} placeholder="Write a comment..." value={props.comment.message}>
                                <div class="comments--form-buttons">
                                    <div class="comments--form-buttons-right">
                                        <button class="comments--form-buttons-right-cancel" onClick={() => setEditing(false)}>Cancel</button>
                                        <button class="comments--form-buttons-right-post" onClick={() => {
                                            if (props.actions.editComment && textbox?.value) {
                                                props.actions.editComment(props.comment, textbox.value);
                                                textbox.value = "";
                                            }
                                        }}>Edit</button>
                                    </div>
                                </div>
                            </TextBox>
                        </Show>
                        <Show when={!editing()}>
                            <p>{props.comment.message}</p>
                        </Show>
                    </div>
                    <div class="comments--list-comment-content-body-actions">
                        <Show when={props.meta.canPin}>
                            <button onClick={() => {
                                if (props.actions.pinComment) {
                                    props.actions.pinComment(props.comment);
                                }
                            }}>{props.comment.pinned ? "Unpin" : "Pin"}</button>
                        </Show>
                        <Show when={props.meta.canEdit}>
                            <button onClick={() => setEditing(!editing())}>Edit</button>
                        </Show>
                        <Show when={props.meta.canDelete}>
                            <button onClick={() => {
                                if (props.actions.deleteComment) {
                                    props.actions.deleteComment(props.comment);
                                }
                            }}>Delete</button>
                        </Show>
                        <button onClick={() => setReplying(!replying())}>Reply</button>
                        <button>Share</button>
                        <button>Report</button>
                    </div>
                    <Show when={replying()}>
                        <div class="comments--list-comment-content-body-reply">
                            <TextBox ref={textbox} placeholder="Write a comment...">
                                <div class="comments--form-buttons">
                                    <div class="comments--form-buttons-right">
                                        <button class="comments--form-buttons-right-cancel" onClick={() => setReplying(false)}>Cancel</button>
                                        <button class="comments--form-buttons-right-post" onClick={() => {
                                            if (props.actions.createComment && textbox?.value) {
                                                props.actions.createComment(textbox.value, props.comment);
                                                textbox.value = "";
                                            }
                                        }}>Post</button>
                                    </div>
                                </div>
                            </TextBox>
                        </div>
                    </Show>
                </Show>
            </div>
        </div>
    </div>;
}