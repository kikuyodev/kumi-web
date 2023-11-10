import { faCommentAlt, faPenAlt, faUserFriends, faWarning } from "@fortawesome/free-solid-svg-icons";
import { useRouteData } from "@solidjs/router";
import { Fa } from "solid-fa";
import { Show } from "solid-js";
import { GroupBadge } from "../components/GroupBadge";
import { UserData } from "../data/UserRouteData";
import { Account } from "../structures/Account";
import { Permissions, PermissionsUtils } from "../util/Permissions";
import "../styles/pages/user.scss";

export function UserPage() {
    const user = useRouteData<typeof UserData>();
    
    return <div class="user">
        <div class="user--background">
            <img src={"https://pbs.twimg.com/media/F-Our2oagAAuDGA?format=jpg&name=orig"} alt="background" />
            <div class="user--background-overlay" />
        </div>
        <div class="user--content">
            <div class="user--content-profile">
                <div class="user--content-profile-left">
                    <img src={`${import.meta.env.KUMI_API_URL}cdn/avatars/${user()?.id}`} alt="avatar" />
                    <div class="user--content-profile-left-info">
                        <div class="user--content-profile-left-info-username">
                            <p class="user--content-profile-left-info-username-username">{user()?.username}</p>
                            <Show when={user()?.primary !== undefined}>
                                <GroupBadge group={user()!.primary!} />
                            </Show>
                        </div>
                        <Show when={user()?.primary !== undefined}>
                            <div class="user--content-profile-left-info-group" style={{ color: user()?.title ? user()?.primary?.color : "inherit" }}>{user()?.title ? user()?.title : user()?.primary?.name}</div>
                        </Show>
                        <div class="user--content-profile-left-buttons">
                            <div class="user--content-profile-left-buttons-left">
                                <button class="user--content-profile-left-buttons-follow">
                                    <Fa icon={faUserFriends} />
                                    <p>10</p>
                                </button>
                                <button class="user--content-profile-left-buttons-chat">
                                    <Fa icon={faCommentAlt} />
                                </button>
                            </div>
                            <Show when={currentIsModerator()}>
                                <div class="user--content-profile-left-buttons-right">
                                    <button class="user--content-profile-left-buttons-restrict">
                                        <Fa icon={faWarning} />
                                        <p>Restrict</p>
                                    </button>
                                </div>
                            </Show>
                        </div>
                    </div>
                </div>
                <div class="user--content-profile-right">
                    <Show when={Account.instance.apiAccount?.id === user()?.id}>
                        <button class="user--content-profile-right-edit">
                            <Fa icon={faPenAlt} />
                            <p>Change Banner</p>
                        </button>
                    </Show>
                </div>
            </div>
            <div class="user--content-ranking">
                <div class="user--content-ranking-graph" />
                <div class="user--content-ranking-info">
                    <div class="user--content-ranking-info-ranking">
                        <h1>GLOBAL RANKING</h1>
                        <p>#12,485</p>
                    </div>
                    <div class="user--content-ranking-info-ranking">
                        <h1>COUNTRY RANKING</h1>
                        <p>#485</p>
                    </div>
                </div>
            </div>
            <div class="user--content-activity">
                <div class="user--content-activity-about_me">
                    <div class="user--content-activity-about_me--background">
                        {/* <img src="https://pbs.twimg.com/media/F-fpbMbbkAAEAGb?format=jpg&name=orig" alt="about me background" /> */}
                    </div>
                    <div class="user--content-activity-about_me--container">
                        <h1>ABOUT ME</h1>
                        <div class="user--content-activity-about_me--container-content">
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus facilisis sapien metus, et placerat nisl lobortis id. Praesent ac imperdiet tortor. Praesent blandit nunc.</p>
                        </div>
                    </div>
                </div>
                <div class="user--content-activity-statistics">
                    <h1>STATISTICS</h1>
                    <div class="user--content-activity-statistics-container">
                        <div class="user--content-activity-statistics-container-group">
                            <h1>Total score</h1>
                            <p>1,995,625,525</p>
                        </div>
                        <div class="user--content-activity-statistics-container-group">
                            <h1>Ranked score</h1>
                            <p>634,172,238</p>
                        </div>
                        <div class="user--content-activity-statistics-container-group">
                            <h1>Play count</h1>
                            <p>3,792</p>
                        </div>
                        <div class="user--content-activity-statistics-container-group">
                            <h1>Maximum combo</h1>
                            <p>1,707</p>
                        </div>
                        <div class="user--content-activity-statistics-container-group">
                            <h1>Total play time</h1>
                            <p>4d 19h 3m</p>
                        </div>
                        <div class="user--content-activity-statistics-container-group">
                            <h1>Joined on</h1>
                            <p>9th November 2023</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>;
}

function currentIsModerator() {
    if (Account.instance.apiAccount === undefined) {
        return false;
    }

    return Account.instance.apiAccount.groups.some(group => PermissionsUtils.hasPermission(group.permissions, Permissions.MODERATE_ACCOUNTS));
}