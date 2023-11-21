import { useParams } from "@solidjs/router";
import { ForumsBreadcrumbs } from "../../components/forums/ForumBreadcrumbs";
import { ForumHeader } from "../../components/forums/ForumHeader";
import { useApi } from "../../contexts/ApiAccessContext";
import "../../styles/pages/forums/forum.scss";
import { Fa } from "solid-fa";
import { faCommentAlt as faCommentAltSolid, faPlus } from "@fortawesome/free-solid-svg-icons";
import { faCommentAlt as faCommentAltRegular } from "@fortawesome/free-regular-svg-icons";
import { SegmentedControl } from "../../components/controls/SegmentedControl";
import { ApiThread } from "../../structures/api/ApiForum";
import { Accessor, For, Show, createMemo } from "solid-js";
import { AccountFlyout } from "../../components/flyouts/AccountFlyout";
import { Util } from "../../util/Util";
import { PaginationMeta } from "../../util/api/ApiResponse";

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

    return <div class="forum">
        <div class="forum--background">
            <img src="" alt="" />
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
                <ForumsBreadcrumbs crumbs={[{
                    name: forum()?.name ?? "",
                    href: `/forums/${forum()?.id}`
                }]} />
                <div class="forum--content-body-content">
                    <div class="forum--content-body-content-section">
                        <div class="forum--content-body-content-section-title">
                            <span style={{ "background-color": "#33CCFF" }} />
                            <h1>Subforums</h1>
                        </div>
                    </div>
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
                </div>
            </div>
        </div>
    </div>;
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
                    <Fa icon={faCommentAltRegular}  />
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