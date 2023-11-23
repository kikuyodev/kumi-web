import { useParams, useSearchParams } from "@solidjs/router";
import { ForumsBreadcrumbs } from "../../components/forums/ForumBreadcrumbs";
import { ForumHeader } from "../../components/forums/ForumHeader";
import { useApi } from "../../contexts/ApiAccessContext";
import { Util } from "../../util/Util";
import "../../styles/pages/forums/thread.scss";
import { useAccount } from "../../contexts/AccountContext";
import { TextBox } from "../../components/controls/TextBox";
import { For, Show, createEffect, createMemo, createSignal } from "solid-js";
import { ApiThreadPost, ForumThreadFlags } from "../../structures/api/ApiForum";
import { GroupTag } from "../../components/accounts/GroupTag";
import { EmojiUtil } from "../../util/EmojiUtil";
import { Tooltip } from "../../components/Tooltip";
import { BBCode } from "../../components/markup/BBCode";
import { Pagination } from "../../components/Pagination";
import { PaginationMeta } from "../../util/api/ApiResponse";
import { Fa } from "solid-fa";
import { faChevronUp, faLock, faLockOpen, faThumbTack, faThumbtack } from "@fortawesome/free-solid-svg-icons";
import anime from "animejs";

interface ThreadPostMeta {
    can_edit: boolean;
    can_delete: boolean;
}

interface ThreadPostsMeta extends PaginationMeta {
    posts: ThreadPostMeta[];
}

interface ThreadMeta {
    can_reply: boolean;
    can_move: boolean;
    can_pin: boolean;
    can_lock: boolean;
}

export function Thread() {
    const account = useAccount();
    const params = useParams();
    const [searchParams] = useSearchParams();

    const thread = useApi(async api => await api.forum.getForumThread(params.id));
    const threadMeta = createMemo(() => thread()?.parseMeta<ThreadMeta>());

    const [posts, setPosts] = createSignal<ApiThreadPost[] | undefined>(undefined);
    const [meta, setMeta] = createSignal<ThreadPostsMeta | undefined>(undefined);

    let scrollButton: HTMLButtonElement | undefined = undefined;
    let textbox: HTMLTextAreaElement | undefined = undefined;

    createEffect(() => {
        useApi(async api => {
            const posts = await api.forum.getPosts(params.id, parseInt(searchParams.page ?? "1"));

            setPosts(posts?.data?.posts ?? []);
            setMeta(posts?.parseMeta<ThreadPostsMeta>());
        });
    });

    document.addEventListener("scroll", () => {
        if (scrollButton) {
            if (window.scrollY > 200) {
                scrollButton.style.display = "block";
            } else {
                scrollButton.style.display = "none";
            }
        }
    });

    function modifyThread(body: Record<string, boolean>) {
        useApi(async api => {            
            const thread = await api.forum.editForumThread(params.id, body);

            if (thread) {
                window.location.reload();
            }
        });
    }

    const isPinned = createMemo(() => ((thread()?.data?.thread.flags ?? 0) & ForumThreadFlags.Pin) === ForumThreadFlags.Pin);
    const isLocked = createMemo(() => ((thread()?.data?.thread.flags ?? 0) & ForumThreadFlags.Lock) === ForumThreadFlags.Lock);

    return <div class="thread">
        <div class="thread--background">
            <img src="" alt="" style={{ opacity: 0 }} onLoad={(v) => {
                anime({
                    targets: v.target,
                    opacity: [
                        { value: 0, duration: 0 },
                        { value: 1, duration: 1000 }
                    ],
                    easing: "linear"
                });
            }} />
            <div class="thread--background-overlay" />
        </div>
        <div class="thread--content">
            <div class="thread--content-header">
                <h1>Community</h1>
                <p>•</p>
                <p>Forums</p>
            </div>
            <div class="thread--content-body">
                <div class="thread--content-body-title">
                    <div class="thread--content-body-title-header">
                        <ForumHeader name={thread()?.data?.thread.forum.name ?? ""} description={`Posted ${Util.getRelativeTimeString(thread()?.data?.thread.created_at ? new Date(thread()!.data!.thread.created_at!) : new Date())}`} color="#33CCFF" fadedDescription={true} />
                        <div class="thread--content-body-title-header-actions">
                            <button ref={scrollButton} style={{ display: "none" }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                                <Fa icon={faChevronUp} />
                            </button>
                            <Show when={threadMeta()?.can_lock}>
                                <Show when={!isLocked()}>
                                    <button onClick={() => modifyThread({ lock: true })}>
                                        <Fa icon={faLock} />
                                    </button>
                                </Show>
                                <Show when={isLocked()}>
                                    <button onClick={() => modifyThread({ unlock: true })}>
                                        <Fa icon={faLockOpen} />
                                    </button>
                                </Show>
                            </Show>
                            <Show when={threadMeta()?.can_pin}>
                                <Show when={!isPinned()}>
                                    <button onClick={() => modifyThread({ pin: true })}>
                                        <Fa icon={faThumbTack} rotate={45} />
                                    </button>
                                </Show>
                                <Show when={isPinned()}>
                                    <button onClick={() => modifyThread({ pin: false })}>
                                        <Fa icon={faThumbtack} />
                                    </button>
                                </Show>
                            </Show>
                        </div>
                    </div>
                    <ForumsBreadcrumbs crumbs={[{
                        name: thread()?.data?.thread.forum.name ?? "",
                        href: `/forums/${thread()?.data?.thread.forum?.id}`
                    },
                    {
                        name: thread()?.data?.thread.title ?? "",
                        href: `/forums/thread/${thread()?.data?.thread.id}`
                    }]} />
                </div>
                <div class="thread--content-body-content">
                    <div class="thread--content-body-content-list">
                        <For each={posts()}>{post => <Post threadId={thread()?.data?.thread.id ?? 0} post={post} meta={meta()?.posts[post.id]} />}</For>
                    </div>
                    <div class="thread--content-body-content-pagination">
                        <Pagination meta={meta} requestPage={(p) => {
                            useApi(async api => {
                                const posts = await api.forum.getPosts(params.id, p);

                                setPosts(posts?.data?.posts ?? []);
                                setMeta(posts?.parseMeta<ThreadPostsMeta>());

                                // change url but don't reload
                                window.history.pushState({}, "", `/forums/threads/${params.id}?page=${p}`);

                                // scroll to top
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            });
                        }} />
                    </div>
                    <div class="thread--content-body-content-reply">
                        <Show when={account.isLoggedIn()}>
                            <TextBox ref={textbox} placeholder="Type your post content here." rows={9}>
                                <div class="thread--content-body-content-reply-textbox">
                                    <div class="thread--content-body-content-reply-textbox-left">
                                        <p>BBCode</p>
                                    </div>
                                    <div class="thread--content-body-content-reply-textbox-right">
                                        <button class="thread--content-body-content-reply-textbox-right-post" onClick={() => {
                                            useApi(async api => {
                                                const post = await api.forum.createPost(params.id, {
                                                    body: textbox!.value
                                                });

                                                if (post) {
                                                    window.location.reload();
                                                }
                                            });
                                        }}>Post</button>
                                    </div>
                                </div>
                            </TextBox>
                        </Show>
                    </div>
                </div>
            </div>
        </div>
    </div>;
}

export function Post(props: {
    threadId: string | number;
    post: ApiThreadPost;
    meta: ThreadPostMeta | undefined;
}) {
    const joinedShortFormat = Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
    });
    const joinedFormat = Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
    });

    const datePostedFormat = Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const timePostedFormat = Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
    });

    const [editing, setEditing] = createSignal(false);

    let textbox: HTMLTextAreaElement | undefined = undefined;

    return <div id={props.post.id.toString()} class="thread--post">
        <div class="thread--post-account">
            <a href={`/accounts/${props.post.author.id}`} class="thread--post-account-core">
                <img class="thread--post-account-core-avatar" src={Util.getCdnFor("avatars", props.post.author.id)} alt="avatar" />
                <div class="thread--post-account-core-info">
                    <h1>{props.post.author.username}</h1>
                    <Show when={props.post.author.title}>
                        <h2 style={{ color: props.post.author.primary?.color }}>{props.post.author.title}</h2>
                    </Show>
                    <Show when={props.post.author.primary}>
                        <div class="thread--post-account-core-info-tag">
                            <GroupTag group={props.post.author.primary} />
                        </div>
                    </Show>
                </div>
                { /* eslint-disable-next-line solid/no-innerhtml */}
                <div class="thread--post-account-core-country" innerHTML={EmojiUtil.getFlagEmoji(props.post.author.country.code)} />
            </a>
            <div class="thread--post-account-info">
                <div class="thread--post-account-info-level">
                    <p>LVL. {props.post.author.forum_statistics.level}</p>
                    <div class="thread--post-account-info-level-progress">
                        <span class="thread--post-account-info-level-progress-bar" style={{ width: `${props.post.author.forum_statistics.exp_progress}%` }} />
                    </div>
                </div>
                <div class="thread--post-account-info-stats">
                    <div class="thread--post-account-info-stats-stat">
                        <p>Joined</p>
                        <h1>
                            <Tooltip text={joinedFormat.format(new Date(props.post.author.created_at))}>
                                {joinedShortFormat.format(new Date(props.post.author.created_at))}
                            </Tooltip>
                        </h1>
                    </div>
                    <div class="thread--post-account-info-stats-stat">
                        <p>Posts</p>
                        <h1>{props.post.author.forum_statistics.posts ?? 0}</h1>
                    </div>
                </div>
            </div>
        </div>
        <div class="thread--post-content">
            <div class="thread--post-content-top">
                <div class="thread--post-content-top-date">
                    <p>{datePostedFormat.format(new Date(props.post.updated_at ?? props.post.created_at!))}</p>
                    <p>•</p>
                    <p>{timePostedFormat.format(new Date(props.post.updated_at ?? props.post.created_at!))}</p>
                    <Show when={props.post.editor}>
                        <p>•</p>
                        <p>Edited by {props.post.editor!.username}</p>
                    </Show>
                </div>
                <div class="thread--post-content-top-id">
                    <a href={`#${props.post.id}`}>#{props.post.id}</a>
                </div>
            </div>
            <div class="thread--post-content-body">
                <Show when={editing()}>
                    <TextBox ref={textbox} placeholder="Type your post content here" value={props.post.body} lightness="var(--hsl-c3)" rows={9}>
                        <div class="thread--post-content-textbox">
                            <div class="thread--post-content-textbox-left">
                                <p>BBcode</p>
                            </div>
                            <div class="thread--post-content-textbox-right">
                                <button class="thread--post-content-textbox-right-cancel" onClick={() => setEditing(false)}>Cancel</button>
                                <button class="thread--post-content-textbox-right-edit" onClick={() => {
                                    useApi(async api => {
                                        const post = await api.forum.editPost(props.threadId, props.post.id, {
                                            body: textbox!.value
                                        });

                                        if (post) {
                                            setEditing(false);
                                            window.location.reload();
                                        }
                                    });
                                }}>Edit</button>
                            </div>
                        </div>
                    </TextBox>

                </Show>
                <Show when={!editing()}>
                    <BBCode>{props.post.body}</BBCode>
                </Show>
            </div>
            <div class="thread--post-content-actions">
                <Show when={props.meta?.can_edit}>
                    <button onClick={() => setEditing(!editing())}>Edit</button>
                </Show>
                <Show when={props.meta?.can_delete}>
                    <button onClick={() => {
                        useApi(async api => {
                            const post = await api.forum.deletePost(props.threadId, props.post.id);

                            if (post) {
                                window.location.reload();
                            }
                        });
                    }}>Delete</button>
                </Show>
            </div>
        </div>
    </div>;
}