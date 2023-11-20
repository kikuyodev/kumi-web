import { useIntl } from "@cookbook/solid-intl";
import { faCommentAlt, faPenAlt, faUserFriends, faWarning } from "@fortawesome/free-solid-svg-icons";
import { useRouteData } from "@solidjs/router";
import { Fa } from "solid-fa";
import { For, Show, createEffect, createSignal } from "solid-js";
import { GroupTag } from "../components/accounts/GroupTag";
import { useAccount } from "../contexts/AccountContext";
import { AccountData } from "../data/AccountData";
import "../styles/pages/account.scss";
import { EmojiUtil } from "../util/EmojiUtil";
import { useApi } from "../contexts/ApiAccessContext";
import { ApiChartSet, ApiChartSetStatus } from "../structures/api/ApiChartSet";
import { ChartCard } from "../components/charts/ChartCard";

export function AccountPage() {
    const account = useRouteData<typeof AccountData>();
    const self = useAccount();
    const intl = useIntl();

    let [charts, setCharts] = createSignal<ApiChartSet[]>([]);

    createEffect(() => {
        if (account() === undefined) {
            return;
        }

        useApi(async (access) => {
            let charts = await access.getChartSets(account()?.id ?? 0);
            setCharts(charts!);
        });
    });

    return <div class="account">
        <div class="account--background">
            <img src={"https://pbs.twimg.com/media/F-Our2oagAAuDGA?format=jpg&name=orig"} alt="background" />
            <div class="account--background-overlay" />
        </div>
        <div class="account--content">
            <div class="account--content-profile">
                <div class="account--content-profile-left">
                    <img src={`${import.meta.env.KUMI_API_URL}cdn/avatars/${account()?.id}`} alt="avatar" />
                    <div class="account--content-profile-left-info">
                        <div class="account--content-profile-left-info-username">
                            <p class="account--content-profile-left-info-username-username">{account()?.username}</p>
                            { /* eslint-disable-next-line solid/no-innerhtml */}
                            <div class="account--content-profile-left-info-username-flag" innerHTML={EmojiUtil.getFlagEmoji(account()?.country.code ?? "XX")} />
                            <Show when={account()?.primary !== undefined}>
                                <For each={account()?.groups}>
                                    {group => <GroupTag group={group} />}
                                </For>
                            </Show>
                        </div>
                        <Show when={account()?.title !== undefined}>
                            <div class="account--content-profile-left-info-group" style={{
                                color: account()?.primary !== undefined ? account()?.primary?.color : "white"
                            }}>
                                {account()?.title}
                            </div>
                        </Show>
                        <div class="account--content-profile-left-buttons">
                            <div class="account--content-profile-left-buttons-left">
                                <button class="account--content-profile-left-buttons-follow">
                                    <Fa icon={faUserFriends} />
                                    <p>10</p>
                                </button>
                                <button class="account--content-profile-left-buttons-chat">
                                    <Fa icon={faCommentAlt} />
                                </button>
                            </div>
                            <Show when={currentIsModerator()}>
                                <div class="account--content-profile-left-buttons-right">
                                    <button class="account--content-profile-left-buttons-restrict">
                                        <Fa icon={faWarning} />
                                        <p>Restrict</p>
                                    </button>
                                </div>
                            </Show>
                        </div>
                    </div>
                </div>
                <div class="account--content-profile-right">
                    <Show when={self.apiAccount?.id === account()?.id}>
                        <button class="account--content-profile-right-edit">
                            <Fa icon={faPenAlt} />
                            <p>Change Banner</p>
                        </button>
                    </Show>
                </div>
            </div>
            <Show when={account() !== undefined && account()!.badges.length >= 0}>
                <div class="account--content-badges">
                    <For each={account()?.badges}>
                        {badge => <img class="account--content-badges--badge" src={badge.asset_url} alt="badge" />}
                    </For>
                </div>
            </Show>
            <div class="account--content-ranking">
                <div class="account--content-ranking-graph" />
                <div class="account--content-ranking-info">
                    <div class="account--content-ranking-info-ranking">
                        <h1>GLOBAL RANKING</h1>
                        <p>#{intl.formatNumber(account()?.ranking.global_rank ?? 0)}</p>
                    </div>
                    <div class="account--content-ranking-info-ranking">
                        <h1>COUNTRY RANKING</h1>
                        <p>#{intl.formatNumber(account()?.ranking.country_rank ?? 0)}</p>
                    </div>
                </div>
            </div>
            <div class="account--content-activity">
                <div class="account--content-activity-about_me">
                    <div class="account--content-activity-about_me--background">
                        {/* <img src="https://pbs.twimg.com/media/F-fpbMbbkAAEAGb?format=jpg&name=orig" alt="about me background" /> */}
                    </div>
                    <div class="account--content-activity-about_me--container">
                        <h1>ABOUT ME</h1>
                        <div class="account--content-activity-about_me--container-content">
                            <p>{account()?.biography ?? "No biography provided..."}</p>
                        </div>
                    </div>
                </div>
                <div class="account--content-activity-statistics">
                    <h1>STATISTICS</h1>
                    <div class="account--content-activity-statistics-container">
                        <div class="account--content-activity-statistics-container-group">
                            <h1>Total score</h1>
                            <p>{intl.formatNumber(BigInt(account()?.statistics.total_score ?? "0"))}</p>
                        </div>
                        <div class="account--content-activity-statistics-container-group">
                            <h1>Ranked score</h1>
                            <p>{intl.formatNumber(BigInt(account()?.statistics.ranked_score ?? "0"))}</p>
                        </div>
                        <div class="account--content-activity-statistics-container-group">
                            <h1>Play count</h1>
                            <p>{intl.formatNumber(account()?.statistics.total_playcount ?? 0)}</p>
                        </div>
                        <div class="account--content-activity-statistics-container-group">
                            <h1>Maximum combo</h1>
                            <p>{intl.formatNumber(BigInt(account()?.statistics.maximum_combo ?? "0"))}</p>
                        </div>
                        <div class="account--content-activity-statistics-container-group">
                            <h1>Total play time</h1>
                            <p>{intl.formatList([
                                (() => {
                                    // split the play time into hours, minutes, and seconds.
                                    const seconds = account()?.statistics.total_playtime ?? 0;
                                    const hours = Math.floor(seconds / 3600);
                                    const minutes = Math.floor((seconds % 3600) / 60);
                                    const secondsLeft = seconds % 60;

                                    return [
                                        hours > 0 ? `${hours}h` : undefined,
                                        minutes > 0 ? `${minutes}m` : undefined,
                                        secondsLeft >= 0 ? `${secondsLeft}s` : undefined
                                    ].filter(v => v !== undefined);
                                })()
                            ], { type: "unit" })}</p>
                        </div>
                        <div class="account--content-activity-statistics-container-group">
                            <h1>Joined on</h1>
                            <p>{intl.formatDate(account()?.created_at ? new Date(account()!.created_at) : new Date(), {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="account--content-maps">
                <div class="account--content-maps-container">
                    {/* <div class="account--content-maps-section">
                        <div class="account--content-maps-section-title">
                            <h1>MAPS</h1>
                            <p>•</p>
                            <p>FAVOURITE</p>
                        </div>
                        <div class="account--content-maps-section-list">
                        </div>
                    </div> */}
                    <div class="account--content-maps-section">
                        <div class="account--content-maps-section-title">
                            <h1>MAPS</h1>
                            <p>•</p>
                            <p>RANKED</p>
                        </div>
                        <div class="account--content-maps-section-list">
                            <For each={charts()?.filter(v => v.status === ApiChartSetStatus.Ranked)}>
                                {chart => <ChartCard {...chart} />}
                            </For>
                            <For each={charts()?.filter(v => v.status === ApiChartSetStatus.Qualified)}>
                                {chart => <ChartCard {...chart} />}
                            </For>
                        </div>
                    </div>
                    <div class="account--content-maps-section">
                        <div class="account--content-maps-section-title">
                            <h1>MAPS</h1>
                            <p>•</p>
                            <p>PENDING</p>
                        </div>
                        <div class="account--content-maps-section-list">
                            <For each={charts()?.filter(v => v.status === ApiChartSetStatus.Pending)}>
                                {chart => <ChartCard {...chart} />}
                            </For>
                        </div>
                    </div>
                    <div class="account--content-maps-section">
                        <div class="account--content-maps-section-title">
                            <h1>MAPS</h1>
                            <p>•</p>
                            <p>GRAVEYARD</p>
                        </div>
                        <div class="account--content-maps-section-list">
                            <For each={charts()?.filter(v => v.status === ApiChartSetStatus.Graveyard)}>
                                {chart => <ChartCard {...chart} />}
                            </For>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>;
}

function currentIsModerator() {
    return false;
}