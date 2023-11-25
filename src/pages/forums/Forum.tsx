import { useParams } from "@solidjs/router";
import { ForumsBreadcrumbs } from "../../components/forums/ForumBreadcrumbs";
import { ForumHeader } from "../../components/forums/ForumHeader";
import { useApi } from "../../contexts/ApiAccessContext";
import "../../styles/pages/forums/forum.scss";
import { Fa } from "solid-fa";
import { faCommentAlt as faCommentAltSolid, faPlus } from "@fortawesome/free-solid-svg-icons";
import { faCommentAlt as faCommentAltRegular } from "@fortawesome/free-regular-svg-icons";
import { SegmentedControl } from "../../components/controls/SegmentedControl";
import { ApiForum, ApiThread } from "../../structures/api/ApiForum";
import { Accessor, For, Show, createMemo } from "solid-js";
import { AccountFlyout } from "../../components/flyouts/AccountFlyout";
import { Util } from "../../util/Util";
import { PaginationMeta } from "../../util/api/ApiResponse";
import { Pagination } from "../../components/Pagination";
import anime from "animejs";

interface ForumMeta extends PaginationMeta {
    threads: {
        is_read: boolean;
    }[]
}

export function Forum() {
    const params = useParams();
    const forum = useApi(async api => await api.forum.getForum(params.id));
    const threads = useApi(async api => await api.forum.getForumThreads(params.id));

    const meta = createMemo(() => {
        if (!threads()?.meta) {
            return;
        }

        return threads()?.parseMeta<ForumMeta>();
    });

    const crumbs = createMemo(() => {
        if (forum() === undefined) {
            return [];
        }

        // recursively loop through the forum's parents to get the full path
        const crumbs: { name: string; href: string }[] = [];
        let current = forum()!;

        while (current.parent != null) {
            if (!current.parent.is_category) {
                crumbs.push({
                    name: current.parent.name,
                    href: `/forums/${current.parent.id}`
                });
            }

            current = current.parent;
        }

        crumbs.reverse();
        crumbs.push({
            name: forum()!.name,
            href: `/forums/${forum()!.id}`
        });

        return crumbs;
    });

    return <div class="forum">
        <div class="forum--background">
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
            <div class="forum--background-overlay" />
        </div>
        <div class="forum--content">
            <div class="forum--content-header">
                <h1>Community</h1>
                <p>•</p>
                <p>Forums</p>
            </div>
            <div class="forum--content-body">
                <ForumHeader name={forum()?.name ?? ""} description={forum()?.description ?? ""} color="#33CCFF" />
                <ForumsBreadcrumbs crumbs={crumbs()!} />
                <div class="forum--content-body-content">
                    <Show when={(forum()?.children.length ?? 0) > 0}>
                        <div class="forum--content-body-content-section">
                            <div class="forum--content-body-content-section-title">
                                <span style={{ "background-color": "#33CCFF" }} />
                                <h1>Subforums</h1>
                            </div>
                            <div class="forum--content-body-content-section-list">
                                <For each={forum()?.children}>{subforum => <Subforum {...subforum} />}</For>
                            </div>
                        </div>
                    </Show>
                    <div class="forum--content-body-content-section">
                        <div class="forum--content-body-content-section-title">
                            <span style={{ "background-color": "#33CCFF" }} />
                            <h1>Threads</h1>
                        </div>
                        <div class="forum--content-body-content-section-actions">
                            <button>
                                <Fa icon={faPlus} />
                                <p>New thread</p>
                            </button>
                            <div class="forum--content-body-content-section-actions-sort">
                                <p>Sort by</p>
                                <SegmentedControl options={["Last reply", "Created"]} selected="Created" />
                            </div>
                        </div>
                        <div class="forum--content-body-content-section-list">
                            <For each={threads()?.data?.threads}>{thread => <Thread thread={thread} meta={meta} />}</For>
                        </div>
                    </div>
                    <div class="forum--content-body-content-pagination">
                        <Pagination meta={meta} />
                    </div>
                </div>
            </div>
        </div>
    </div>;
}

function Subforum(props: ApiForum) {
    return <a href={`/forums/${props.id}`}>
        <div class="forum--content-body-content-section-list--subforum">
            <div class="forum--content-body-content-section-list--subforum-left">
                <h1>{props.name}</h1>
                <p>{props.description}</p>
            </div>
            <Show when={props.last_thread !== null}>
                <div class="forum--content-body-content-section-list--subforum-right">
                    <div class="forum--content-body-content-section-list--subforum-right-content">
                        <h1>{props.last_thread!.title}</h1>
                        <p>
                            {Util.getRelativeTimeString(new Date(props.last_thread?.updated_at ?? props.last_thread!.created_at!))} by
                            <AccountFlyout account={props.last_thread!.author}>
                                <a href={`/accounts/${props.last_thread!.author.id}`}>
                                    <Show when={props.last_thread!.author.primary}>
                                        <span style={{ "background-color": props.last_thread!.author.primary!.color }} />
                                    </Show>
                                    {props.last_thread!.author.username}
                                </a>
                            </AccountFlyout>
                        </p>
                    </div>
                </div>
            </Show>
        </div>
    </a>;
}

function Thread(props: {
    thread: ApiThread;
    meta: Accessor<ForumMeta | undefined>;
}) {
    const isRead = createMemo(() => {
        if (!props.meta()?.threads[props.thread.id]) {
            return false;
        }

        return props.meta()?.threads[props.thread.id].is_read;
    });

    return <a href={`/forums/threads/${props.thread.id}`} class="forum--content-body-content-section-list--thread">
        <div class="forum--content-body-content-section-list--thread-left">
            <div class={`forum--content-body-content-section-list--thread-left-icon ${isRead() ? "forum--content-body-content-section-list--thread-left-icon-read" : ""}`}>
                <Show when={!isRead()}>
                    <Fa icon={faCommentAltSolid} />
                </Show>
                <Show when={isRead()}>
                    <Fa icon={faCommentAltRegular} />
                </Show>
            </div>
            <div class="forum--content-body-content-section-list--thread-left-info">
                <Show when={!isRead()}>
                    <span class="forum--content-body-content-section-list--thread-left-info-new" />
                </Show>
                <div class="forum--content-body-content-section-list--thread-left-info-details">
                    <h1>{props.thread.title}</h1>
                    <p>by <AccountFlyout account={props.thread.author}>
                        <a href={`/accounts/${props.thread.author.id}`}>
                            <Show when={props.thread.author.primary}>
                                <span style={{ "background-color": props.thread.author.primary!.color }} />
                            </Show>
                            {props.thread.author.username}
                        </a>
                    </AccountFlyout>
                    </p>
                </div>
            </div>
        </div>
        <div class="forum--content-body-content-section-list--thread-right">
            <div class="forum--content-body-content-section-list--thread-right-last_reply">
                <p>Last reply by <AccountFlyout account={props.thread.last_post?.author}>
                    <a href={`/accounts/${props.thread.last_post?.author.id}`}>
                        <Show when={props.thread.last_post?.author.primary}>
                            <span style={{ "background-color": props.thread.last_post?.author.primary!.color }} />
                        </Show>
                        {props.thread.last_post?.author.username}
                    </a>
                </AccountFlyout></p>
                <p>{Util.getRelativeTimeString(new Date(props.thread.last_post?.updated_at ?? props.thread.last_post!.created_at!))}</p>
            </div>
            <div class="forum--content-body-content-section-list--thread-right-stats">
                <p>Replies: 10</p>
                <p>Views: 19,776</p>
            </div>
        </div>
    </a>;
}