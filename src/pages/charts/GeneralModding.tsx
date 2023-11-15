import { faAtom, faCheck, faClipboard, faClipboardQuestion, faCommentAlt, faPenAlt, faQuestionCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { Fa } from "solid-fa";
import { Accessor, For, Match, Resource, Show, Switch, createEffect, createSignal, onMount } from "solid-js";
import { GroupTag } from "../../components/accounts/GroupTag";
import { ChartPostTextBox } from "../../components/charts/ChartPostTextBox";
import { TextBox } from "../../components/controls/TextBox";
import { useAccount } from "../../contexts/AccountContext";
import { useApi } from "../../contexts/ApiAccessContext";
import { ApiChart, ApiChartSet } from "../../structures/api/ApiChartSet";
import { ApiModdingPost, ApiModdingPostStatus, ApiModdingPostType } from "../../structures/api/ApiModdingPost";
import "../../styles/pages/chart/generalModding.scss";
import { Util } from "../../util/Util";
import { SolidMarkdown } from "solid-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Markdown } from "../../components/Markdown";

type MetaType = {
    can_nominate: boolean;
    can_moderate_posts: boolean;
    posts: PostMetaType[];
};

type PostMetaType = {
    can_reply: boolean;
    can_resolve: boolean;
    can_reopen: boolean;
    can_edit: boolean;
}

export function GeneralModding(props: {
    set: Resource<ApiChartSet | undefined>,
    chart?: Accessor<ApiChart | undefined>,
    posts: ApiModdingPost[] | undefined,
    meta: MetaType | undefined
    isTimeline?: boolean
}) {
    return <div class="general_modding">
        <ChartPostTextBox set={props.set} isTimeline={props.isTimeline} chart={props.chart ?? (() => undefined)} />
        <div class="general_modding--posts">
            <For each={props.posts}>
                {(post, idx) => <GeneralModdingThread set={props.set} post={post} meta={props.meta} idx={idx()} />}
            </For>
        </div>
    </div>;
}

export function GeneralModdingThread(props: {
    set: Resource<ApiChartSet | undefined>,
    post: ApiModdingPost,
    meta: MetaType | undefined,
    idx: number
}) {
    // create an array of all the posts in the thread.
    // this requires a recursive function.
    const posts: ApiModdingPost[] = [];
    const [responding, setResponding] = createSignal(false);
    const parentMeta = props.meta?.posts[props.post.id];
    let respondTextBox: HTMLTextAreaElement | undefined = undefined;

    function getPosts(post: ApiModdingPost) {
        posts.push(post);

        post.children.forEach((child) => {
            child.parent = post; // can't do this on the server side because of circular references.

            getPosts(child);
        });
    }

    getPosts(props.post);

    // sort posts by date.
    posts.sort((a, b) => {
        return new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime();
    });

    function respondToPost(data: {
        resolved?: boolean,
        reopened?: boolean
    }) {
        useApi(async (access) => {
            const result = data.resolved ? await access.sendModdingPost(props.set()!.id, {
                parent: props.post.id,
                message: respondTextBox!.value,
                "attributes[resolved]": data.resolved,
            }) : await access.sendModdingPost(props.set()!.id, {
                parent: props.post.id,
                message: respondTextBox!.value,
                "attributes[reopened]": data.reopened
            });

            console.log(result);

            if (result) {
                window.location.reload();
            }
        });
    }

    return (
        <div class="general_modding--thread">
            <div class="general_modding--thread-left">
                <div class="general_modding--thread-left-status" data-type={ApiModdingPostType[props.post.type].toLowerCase()}>
                    <Switch fallback={<Fa icon={faQuestionCircle} />}>
                        <Match when={props.post.type === ApiModdingPostType.Comment}>
                            <Fa icon={faCommentAlt} />
                        </Match>
                        <Match when={props.post.type === ApiModdingPostType.Note}>
                            <Fa icon={faClipboard} />
                        </Match>
                        <Match when={props.post.type === ApiModdingPostType.Praise}>
                            <Fa icon={faAtom} />
                        </Match>
                        <Match when={props.post.type === ApiModdingPostType.Problem}>
                            <Fa icon={faTimesCircle} />
                        </Match>
                        <Match when={props.post.type === ApiModdingPostType.Suggestion}>
                            <Fa icon={faClipboardQuestion} />
                        </Match>
                    </Switch>
                    <p>{ApiModdingPostStatus[props.post.status].toUpperCase()}</p>
                </div>
                <Show when={props.post.attributes.timestamp}>
                    {/* convert the timeestamp to 00:00.000 format. */}
                    {Util.formatTimestamp(props.post.attributes.timestamp!)}
                </Show>
            </div>
            <div class="general_modding--thread-right">
                <For each={posts}>
                    {(post, idx) => {
                        if (post.type === ApiModdingPostType.System) {
                            return <ModdingThreadSystemPost post={post} />;
                        } else {
                            let result = <ModdingThreadPost set={props.set} post={post} meta={props.meta?.posts[post.id]} isParent={idx() == 0} />;

                            if (idx() !== posts.length - 1 && posts[idx() + 1]?.type !== ApiModdingPostType.System) {
                                return <>
                                    {result}
                                    <div class="general_modding--thread-post-divider" />
                                </>;
                            } else {
                                return result;
                            }
                        }
                    }}
                </For>
                <Show when={responding()}>
                    <TextBox ref={respondTextBox} placeholder={`Type your reply here (replying to ${props.post.author.username})`} lightness="var(--hsl-c3)">
                        <div class="general_modding--thread-reply-buttons">
                            <button class="general_modding--thread-reply-buttons-cancel" onClick={() => {
                                setResponding(false);
                            }}>Cancel</button>
                            <Show when={parentMeta?.can_resolve}>
                                <button class={"general_modding--thread-reply-buttons-resolve"} onClick={() => respondToPost({
                                    resolved: true
                                })}>
                                    <Fa icon={faCheck} />
                                    <p>{"Resolve"}</p>
                                </button>
                            </Show>
                            <Show when={parentMeta?.can_reopen}>
                                <button class={"general_modding--thread-reply-buttons-unresolve"} onClick={() => respondToPost({
                                    reopened: true
                                })}>
                                    <Fa icon={faTimesCircle} />
                                    <p>{"Reopen"}</p>
                                </button>
                            </Show>
                            <button class="general_modding--thread-reply-buttons-post" onClick={() => {
                                useApi(async (access) => {
                                    const result = await access.sendModdingPost(props.set()!.id, {
                                        parent: props.post.id,
                                        message: respondTextBox!.value
                                    });

                                    if (result) {
                                        window.location.reload();
                                    }
                                });
                            }}>
                                <Fa icon={faCommentAlt} />
                                <p>Post</p>
                            </button>
                        </div>
                    </TextBox>
                </Show>
                <Show when={!responding() && useAccount().isLoggedIn() && props.meta?.posts[props.post.id]}>
                    <div class="general_modding--thread-buttons">
                        <button class="general_modding--thread-buttons-button" onClick={() => setResponding(true)}>Respond</button>
                    </div>
                </Show>
            </div>
        </div>
    );
}

export function ModdingThreadPost(props: {
    set: Resource<ApiChartSet | undefined>,
    post: ApiModdingPost,
    meta: PostMetaType | undefined
    isParent?: boolean
}) {
    const account = useAccount();

    const [editing, setEditing] = createSignal(false);
    const [replying, setReplying] = createSignal(false);
    const [content, setContent] = createSignal<string | undefined>(props.post.message);

    let editTextBox: HTMLTextAreaElement | undefined = undefined;
    let replyTextBox: HTMLTextAreaElement | undefined = undefined;
    let editButton: HTMLButtonElement | undefined = undefined;
    let replyButton: HTMLButtonElement | undefined = undefined;

    let markdown: HTMLDivElement | undefined = undefined;

    onMount(() => {
        // fetch the inner contents of the markdown element.
        if (markdown === undefined) {
            return;
        }

        let markdownContent = markdown!.innerHTML;
        const regex = /(\d+):(\d+)(?:\.(\d){3,3})/g;

        markdown!.innerHTML = markdownContent.replaceAll(regex, (match) => {
            return `<a href="kumi://edit/${match}" class="general_modding--thread-post--content-content-timestamp">${match}</a>`;
        });
    });

    return <>
        <div class="general_modding--thread-post" id={props.post.id.toString()}>
            <div class="general_modding--thread-post--content">
                <div class="general_modding--thread-post--content-account">
                    <div class="general_modding--thread-post--content-account-avatar">
                        <img src={`${import.meta.env.KUMI_API_URL}cdn/avatars/${props.post.author.id}`} alt="avatar" />
                    </div>
                    <div class="general_modding--thread-post--content-account-details">
                        <div class="general_modding--thread-post--content-account-details-name">
                            <h1>{props.post.author.username}</h1>
                            <p>• {Util.getRelativeTimeString(new Date(props.post.created_at!))}</p>
                        </div>
                        <Show when={props.post.author.primary}>
                            <div class="general_modding--thread-post--content-account-details-group">
                                <GroupTag group={props.post.author.primary!} />
                            </div>
                        </Show>
                        <Show when={props.post.parent !== undefined}>
                            <div class="general_modding--thread-post--content-parent">
                                {">"}
                                <div class="general_modding--thread-post--content-parent-id">
                                    <a href={`#${props.post.parent?.id}`}>
                                        {`#${props.post.parent?.id}`}
                                    </a>
                                </div>
                            </div>
                        </Show>
                        <Show when={props.post.is_edited}>
                            <p class="general_modding--thread-post--content-account-details-edited">(edited by {props.post.editor?.username})</p>
                        </Show>
                        <div class="general_modding--thread-post--content-account-details-line" style={{ "background-color": props.post.author.primary?.color ?? "var(--hsl-l4)" }} />
                    </div>
                </div>
                <div class="general_modding--thread-post--content-content">
                    <Show when={editing()}>
                        <TextBox ref={editTextBox} value={content()} lightness="var(--hsl-c3)">
                            <div class="general_modding--thread-post--content-content-buttons">
                                <button class="general_modding--thread-post--content-content-buttons-cancel" onClick={() => {
                                    setEditing(false);
                                    editButton!.style.setProperty("color", "var(--hsl-c1)");
                                }}>
                                    <p>Cancel</p>
                                </button>
                                <button class="general_modding--thread-post--content-content-buttons-edit" onClick={() => {
                                    useApi(async (access) => {
                                        const result = await access.editModdingPost(props.set()?.id ?? -1, props.post.id, editTextBox!.value);

                                        if (result) {
                                            setContent(result.message);
                                            props.post.is_edited = true;
                                        }
                                    });

                                    setEditing(false);
                                    editButton!.style.setProperty("color", "var(--hsl-c1)");
                                }}>
                                    <Fa icon={faPenAlt} />
                                    <p>Edit</p>
                                </button>
                            </div>
                        </TextBox>
                    </Show>
                    <Show when={!editing()}>
                        <div ref={markdown}>
                            <Markdown>{content()}</Markdown>
                        </div>
                    </Show>
                </div>
                <div class="general_modding--thread-post--content-buttons">
                    <Show when={props.meta?.can_edit}>
                        <button ref={editButton} onClick={(v) => {
                            setEditing(!editing());

                            let target = v.target as HTMLButtonElement;
                            target.style.setProperty("color", editing() ? "var(--hsl-l2)" : "var(--hsl-c1)");
                        }}>Edit</button>
                    </Show>
                    <button>Share</button>
                    {!props.isParent &&
                        <Show when={account.isLoggedIn()}>
                            <button ref={replyButton} onClick={(v) => {
                                setReplying(!replying());

                                let target = v.target as HTMLButtonElement;
                                target.style.setProperty("color", editing() ? "var(--hsl-l2)" : "var(--hsl-c1)");
                            }}>Reply</button>
                        </Show>}
                    <button>Report</button>
                </div>
            </div>
        </div>
        <Show when={replying()}>
            <div class="general_modding--thread-reply">
                <TextBox ref={replyTextBox} placeholder={`Type your reply here (replying to ${props.post.author.username})`} lightness="var(--hsl-c3)">
                    <div class="general_modding--thread-reply-buttons">
                        <button class="general_modding--thread-reply-buttons-cancel" onClick={() => {
                            setReplying(false);
                            replyButton!.style.setProperty("color", "var(--hsl-c1)");
                        }}>Cancel</button>
                        <button class="general_modding--thread-reply-buttons-post" onClick={() => {
                            useApi(async (access) => {
                                const result = await access.sendModdingPost(props.set()!.id, {
                                    parent: props.post.id,
                                    message: replyTextBox!.value
                                });

                                if (result) {
                                    window.location.reload();
                                }
                            });
                        }}>
                            <Fa icon={faCommentAlt} />
                            <p>Post</p>
                        </button>
                    </div>
                </TextBox>
            </div>
        </Show>
    </>;
}

export function ModdingThreadSystemPost(props: {
    post: ApiModdingPost
}) {
    return (
        <>
            <Show when={props.post.attributes.resolved}>
                <div class="general_modding--thread-system-post" data-system-type="resolved">
                    <div class="general_modding--thread-system-post-bar" data-type="resolved" />
                    <div class="general_modding--thread-system-post-text" data-type="resolved">
                        Marked as resolved by <span><a href="#">{props.post.done_by?.username}</a></span>
                    </div>
                    <div class="general_modding--thread-system-post-bar" data-type="resolved" />
                </div>
            </Show>
            <Show when={props.post.attributes.reopened}>
                <div class="general_modding--thread-system-post" data-system-type="reopened">
                    <div class="general_modding--thread-system-post-bar" data-type="reopened" />
                    <div class="general_modding--thread-system-post-text" data-type="reopened">
                        Marked as reopened by <span><a href="#">{props.post.done_by?.username}</a></span>
                    </div>
                    <div class="general_modding--thread-system-post-bar" data-type="reopened" />
                </div>
            </Show>
        </>
    );
}