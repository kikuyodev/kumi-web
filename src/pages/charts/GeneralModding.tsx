import { faAtom, faClipboard, faClipboardQuestion, faCommentAlt, faQuestionCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { Fa } from "solid-fa";
import { For, Match, Resource, Show, Switch } from "solid-js";
import { GroupTag } from "../../components/accounts/GroupTag";
import { UserFlyout } from "../../components/flyouts/UserFlyout";
import { ApiModdingPost, ApiModdingPostStatus, ApiModdingPostType } from "../../structures/api/ApiModdingPost";
import "../../styles/pages/chart/generalModding.scss";
import { Util } from "../../util/Util";
import { ChartPostTextBox } from "../../components/charts/ChartPostTextBox";
import { ApiChartSet } from "../../structures/api/ApiChartSet";

export function GeneralModding(props: {
    set: Resource<ApiChartSet | undefined>,
    posts: ApiModdingPost[] | undefined
}) {
    return <div class="general_modding">
        <ChartPostTextBox set={props.set} />
        <div class="general_modding--posts">
            <For each={props.posts}>
                {post => <GeneralModdingThread post={post} />}
            </For>
        </div>
    </div>;
}

export function GeneralModdingThread(props: {
    post: ApiModdingPost
}) {
    // create an array of all the posts in the thread.
    // this requires a recursive function.
    const posts: ApiModdingPost[] = [];

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
                <p>00:01:13:422</p>
            </div>
            <div class="general_modding--thread-right">
                <For each={posts}>
                    {(post, idx) => {
                        if (post.type === ApiModdingPostType.System) {
                            return <ModdingThreadSystemPost post={post} />;
                        } else {
                            let result = <ModdingThreadPost post={post} />;

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
            </div>
        </div>
    );
}

export function ModdingThreadPost(props: {
    post: ApiModdingPost
}) {
    const formatter = new Intl.RelativeTimeFormat("en-us", {
        style: "narrow",
        numeric: "auto"
    });

    return (
        <div class="general_modding--thread-post" id={props.post.id}>
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
                                    <a href={`#${props.post.parent.id}`}>
                                        {`#${props.post.parent.id}`}
                                    </a>
                                </div>
                            </div>
                        </Show>
                        <div class="general_modding--thread-post--content-account-details-line" style={{ "background-color": props.post.author.primary?.color ?? "var(--hsl-l4)" }} />
                    </div>
                </div>
                <div class="general_modding--thread-post--content-content">
                    <p>{props.post.message}</p>
                </div>
                <div class="general_modding--thread-post--content-buttons">
                    <button>Share</button>
                    <button>Reply</button>
                    <button>Report</button>
                </div>
            </div>
        </div>
    );
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
        </>
    );
}

export function GeneralModdingPost(props: {
    post: ApiModdingPost
}) {
    const formatter = new Intl.RelativeTimeFormat("en-us", {
        style: "narrow",
        numeric: "auto"
    });

    return <div class="general_modding--posts-post">
        <div class="general_modding--posts-post-right">
            <div class="general_modding--posts-post-right--content">
                <div class="general_modding--posts-post-right--content-account">
                    <div class="general_modding--posts-post-right--content-account-avatar">
                        <img src={`${import.meta.env.KUMI_API_URL}cdn/avatars/${props.post.author.id}`} alt="avatar" />
                    </div>
                    <div class="general_modding--posts-post-right--content-account-details">
                        <div class="general_modding--posts-post-right--content-account-details-name">
                            <h1>{props.post.author.username}</h1>
                            <p>• {formatter.format((((props.post.created_at == null ? new Date() : new Date(props.post.created_at)).getTime() - new Date().getTime()) / 1000), "seconds")}</p>
                        </div>
                        <Show when={props.post.author.primary}>
                            <div class="general_modding--posts-post-right--content-account-details-group">
                                <GroupTag group={props.post.author.primary!} />
                            </div>
                        </Show>
                        <div class="general_modding--posts-post-right--content-account-details-line" style={{ "background-color": props.post.author.primary?.color ?? "var(--hsl-l4)" }} />
                    </div>
                </div>
                <div class="general_modding--posts-post-right--content-content">
                    <p>{props.post.message}</p>
                </div>
                <div class="general_modding--posts-post-right--content-buttons">
                    <button>Share</button>
                    <button>Report</button>
                </div>
                <Show when={props.post.attributes.resolved}>
                    {/* <Show when={true}> */}
                    <div class="general_modding--posts-post-right--content-resolved">
                        <div class="general_modding--posts-post-right--content-resolved-line_short" />
                        <p>
                            Marked as resolved by
                            <UserFlyout account={props.post.author}>
                                <span>{props.post.author.username}</span>
                            </UserFlyout>
                        </p>
                        <div class="general_modding--posts-post-right--content-resolved-line_long" />
                    </div>
                </Show>
            </div>
        </div>
    </div>;
}