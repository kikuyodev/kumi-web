import { For, Match, Show, Switch } from "solid-js";
import { GroupTag } from "./GroupTag";
import { ApiAccount } from "../../structures/api/ApiAccount";
import { EmojiUtil } from "../../util/EmojiUtil";
import { Util } from "../../util/Util";
import "../../styles/components/accounts/accountCard.scss";

export function AccountCard(props: {
    account: ApiAccount;
}) {
    return <a href={`/accounts/${props.account.id}`} class="account_card">
        <div class="account_card--background">
            <img src={Util.getCdnFor("avatars", props.account.id)} alt="background" />
            <div class="account_card--background-overlay" />
        </div>
        <div class="account_card--content">
            <img src={Util.getCdnFor("avatars", props.account.id)} alt="avatar" />
            <div class="account_card--content-info">
                <div class="account_card--content-info-top">
                    <div class="account_card--content-info-top-username">
                        <p>{props.account.username}</p>
                        {/* eslint-disable-next-line solid/no-innerhtml */}
                        <div innerHTML={EmojiUtil.getFlagEmoji(props.account.country.code)} />
                    </div>
                    <div class="account_card--content-info-top-groups">
                        <For each={props.account.groups}>
                            {(badge) => <GroupTag group={badge} />}
                        </For>
                    </div>
                </div>
                <div class="account_card--content-info-bottom">
                    <Show when={props.account.status != undefined}>
                        <div class="account_card--content-info-bottom-status" data-status={props.account.status}>
                            <Switch>
                                <Match when={props.account.status === "online"}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <circle cx="7.5" cy="7.5" r="6.5" stroke="#66CC99" stroke-width="2" />
                                        <circle cx="7.5" cy="7.5" r="2.5" fill="#66CC99" />
                                    </svg>
                                </Match>
                                <Match when={props.account.status === "offline"}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <circle cx="7.5" cy="7.5" r="6.5" stroke="#415258" stroke-width="2" />
                                    </svg>
                                </Match>
                            </Switch>
                            <p>{props.account.status === "online" ? "Online" : "Offline"}</p>
                        </div>
                    </Show>
                </div>
            </div>
        </div>
    </a>;
}