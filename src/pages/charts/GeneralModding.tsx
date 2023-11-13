import { faAtom, faClipboard, faClipboardQuestion, faCommentAlt, faQuestionCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { Fa } from "solid-fa";
import { For, Match, Show, Switch } from "solid-js";
import { GroupTag } from "../../components/accounts/GroupTag";
import { UserFlyout } from "../../components/flyouts/UserFlyout";
import { TextBox } from "../../components/TextBox";
import { ApiModdingPost, ApiModdingPostStatus, ApiModdingPostType } from "../../structures/api/ApiModdingPost";
import "../../styles/pages/chart/generalModding.scss";

export function GeneralModding(props: {
    posts: ApiModdingPost[] | undefined
}) {
    return <div class="general_modding">
        <TextBox placeholder="Type your discussion post here.">
            <button>Post</button>
        </TextBox>
        <div class="general_modding--posts">
            <For each={props.posts}>
                {post => <GeneralModdingPost post={post} />}
            </For>
        </div>
    </div>;
}

export function GeneralModdingPost(props: {
    post: ApiModdingPost
}) {
    const formatter = new Intl.RelativeTimeFormat("en-us", {
        style: "narrow",
        numeric: "auto"
    });

    return <div class="general_modding--posts-post">
        <div class="general_modding--posts-post-left">
            <div class="general_modding--posts-post-left-status" data-type={ApiModdingPostType[props.post.type].toLowerCase()}>
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