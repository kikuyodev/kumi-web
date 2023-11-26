import { For, Match, Show, Switch } from "solid-js";
import { useAccount } from "../../contexts/AccountContext";
import { EmojiUtil } from "../../util/EmojiUtil";
import { Util } from "../../util/Util";
import { GroupTag } from "../accounts/GroupTag";
import "../../styles/components/flyouts/accountNavbarFlyout.scss";
import { useApi } from "../../contexts/ApiAccessContext";

export function AccountNavbarFlyout() {
    const account = useAccount();

    return <div class="account_navbar_flyout">
        <a href={`/accounts/${account.apiAccount!.id}`} class="account_navbar_flyout--card">
            <img src={Util.getCdnFor("avatars", account.apiAccount!.id)} alt="avatar" />
            <div class="account_navbar_flyout--card-info">
                <div class="account_navbar_flyout--card-info-username">{account.apiAccount!.username}</div>
                <div class="account_navbar_flyout--card-info-groups">
                    { /* eslint-disable-next-line solid/no-innerhtml */}
                    <div class="account_navbar_flyout--card-info-groups-country" innerHTML={EmojiUtil.getFlagEmoji(account.apiAccount!.country.code)} />
                    <For each={account.apiAccount?.groups}>
                        {(badge) => <GroupTag group={badge} />}
                    </For>
                </div>
                <Show when={account.apiAccount!.status != undefined}>
                    <div class="account_navbar_flyout--card-info-status" data-status={account.apiAccount!.status}>
                        <Switch>
                            <Match when={account.apiAccount!.status === "online"}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <circle cx="7.5" cy="7.5" r="6.5" stroke="#66CC99" stroke-width="2" />
                                    <circle cx="7.5" cy="7.5" r="2.5" fill="#66CC99" />
                                </svg>
                            </Match>
                            <Match when={account.apiAccount!.status === "offline"}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <circle cx="7.5" cy="7.5" r="6.5" stroke="#415258" stroke-width="2" />
                                </svg>
                            </Match>
                        </Switch>
                        <p>{account.apiAccount!.status === "online" ? "Online" : "Offline"}</p>
                    </div>
                </Show>
            </div>
        </a>
        <div class="account_navbar_flyout--buttons">
            <button onClick={() => window.location.href = `/accounts/${account.apiAccount!.id}`}>My Profile</button>
            <button>Settings</button>
            <button onClick={() => {
                useApi(async api => {
                    api.account.logout();
                    
                    sessionStorage.setItem("logged_in", "false");
                    window.location.reload();
                });
            }}>Sign Out</button>
        </div>
    </div>;
}