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

export function Comments(props: {
    comments?: ApiComment[],
    meta?: CommentMeta
}) {
    const account = useAccount();
    const [comments, setComments] = createSignal<ApiComment[]>([]);
    const [pinnedComments, setPinnedComments] = createSignal<ApiComment[]>([]);

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
                    {comment => <Comment comment={comment} meta={{
                        canPin: props.meta?.can_pin ?? false,
                        canEdit: props.meta?.comments[comment.id].can_edit ?? false,
                        canDelete: props.meta?.comments[comment.id].can_delete ?? false,
                    }} />}
                </For>
            </div>
        </Show>
        <Show when={account.isLoggedIn()}>
            <div class="comments--form">
                <TextBox placeholder="Write a comment..." />
                <p>Commenting as <a href={`/users/${account.apiAccount!.id}`}>{account.apiAccount!.username}</a></p>
            </div>
        </Show>
        <div class="comments--list">
            <For each={comments()}>
                {comment => <Comment comment={comment} meta={{
                    canPin: props.meta?.can_pin ?? false,
                    canEdit: props.meta?.comments[comment.id].can_edit ?? false,
                    canDelete: props.meta?.comments[comment.id].can_delete ?? false,
                }} />}
            </For>
        </div>
    </div>;
}

function Comment(props: {
    comment: ApiComment,
    meta: {
        canPin: boolean,
        canEdit: boolean,
        canDelete: boolean,
    }
}) {
    return <div class="comments--list-comment">
        <div class="comments--list-comment-content">
            <img src={Util.getCdnFor("avatars", props.comment.author.id)} alt="avatar" />
            <div class="comments--list-comment-content-body">
                <div class="comments--list-comment-content-body-username">
                    <a href={`/users/${props.comment.author.id}`}>{props.comment.author.username}</a>
                    <p>• {Util.getRelativeTimeString(new Date(props.comment.created_at!))}</p>
                    <Show when={props.comment.pinned}>
                        <p>(Pinned)</p>
                    </Show>
                </div>
                <div class="comments--list-comment-content-body-content">
                    <p>{props.comment.message}</p>
                </div>
                <div class="comments--list-comment-content-body-actions">
                    <Show when={props.meta.canPin}>
                        <button>Pin</button>
                    </Show>
                    <Show when={props.meta.canEdit}>
                        <button>Edit</button>
                    </Show>
                    <Show when={props.meta.canDelete}>
                        <button>Delete</button>
                    </Show>
                    <button>Reply</button>
                    <button>Share</button>
                    <button>Report</button>
                </div>
            </div>
        </div>
    </div>;
}