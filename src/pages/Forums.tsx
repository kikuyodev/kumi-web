import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { Fa } from "solid-fa";
import { For, Show, createSignal } from "solid-js";
import { AccountFlyout } from "../components/flyouts/AccountFlyout";
import { useApi } from "../contexts/ApiAccessContext";
import { ApiForum } from "../structures/api/ApiForum";
import { Util } from "../util/Util";
import "../styles/pages/forums.scss";
import anime from "animejs";

export function Forums() {
    const forums = useApi(async api => await api.forum.getForums());

    return <div class="forums">
        <div class="forums--background">
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
            <div class="forums--background-overlay" />
        </div>
        <div class="forums--content">
            <div class="forums--content-header">
                <h1>Community</h1>
                <p>•</p>
                <p>Forums</p>
            </div>
            <div class="forums--content-body">
                <For each={forums()}>{forum => <Forum {...forum} />}</For>
            </div>
        </div>
    </div>;
}

function Forum(props: ApiForum) {
    const [expanded, setExpanded] = createSignal(true);

    return <div class="forums--content-body--forum">
        <div class="forums--content-body--forum-header">
            <div class="forums--content-body--forum-header-title">
                <span class="forums--content-body--forum-header-title-color" style={{ "background-color": "#33CCFF" }} />
                <h1>{props.name}</h1>
                <button class="forums--content-body--forum-header-title-chevron" onClick={() => {
                    setExpanded(!expanded());
                }}>
                    <Fa icon={expanded() ? faAngleUp : faAngleDown} />
                </button>
            </div>
            <div class="forums--content-body--forum-header-description">
                <p>{props.description}</p>
            </div>
        </div>
        <Show when={expanded()}>
            <div class="forums--content-body--forum-body">
                <div class="forums--content-body--forum-body-info">
                    <p>Forum</p>
                    <p>Latest Post</p>
                </div>
                <div class="forums--content-body--forum-body-list">
                    <For each={props.children}>{thread => <ForumChildren {...thread} />}</For>
                </div>
            </div>
        </Show>
    </div>;
}

function ForumChildren(props: ApiForum) {
    return <a href={`/forums/${props.id}`} class="forums--content-body--forum-body-list--children">
        <div class="forums--content-body--forum-body-list--children-left">
            <h1>{props.name}</h1>
            <p>{props.description}</p>
        </div>
        <div class="forums--content-body--forum-body-list--children-right">
            <div class="forums--content-body--forum-body-list--children-right-content">
                <h1>{props.last_thread.title}</h1>
                <p>
                    {Util.getRelativeTimeString(new Date(props.last_thread.updated_at ?? props.last_thread.created_at!))} by
                    <AccountFlyout account={props.last_thread.author}>
                        <a href={`/accounts/${props.last_thread.author.id}`}>
                            <Show when={props.last_thread.author.primary}>
                                <span style={{ "background-color": props.last_thread.author.primary!.color }} />
                            </Show>
                            {props.last_thread.author.username}
                        </a>
                    </AccountFlyout>
                </p>
            </div>
        </div>
    </a>;
}