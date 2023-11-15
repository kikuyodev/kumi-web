import { faAtom, faAward, faClipboard, faClipboardQuestion, faCommentAlt, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { Fa } from "solid-fa";
import { Accessor, For, Resource, Show, createEffect, createSignal, onMount } from "solid-js";
import { ApiChart, ApiChartSet } from "src/structures/api/ApiChartSet";
import { AccountChip } from "../../components/accounts/AccountChip";
import { ChartNominationSection } from "../../components/charts/nominations/ChartNominationSection";
import { UserFlyout } from "../../components/flyouts/UserFlyout";
import { ApiModdingPost, ApiModdingPostType } from "../../structures/api/ApiModdingPost";
import "../../styles/pages/chart/moddingPanel.scss";
import { ApiAccount } from "../../structures/api/ApiAccount";
import { defineMessages, useIntl } from "@cookbook/solid-intl";

type MetaType = {
    can_nominate: boolean;
    can_moderate_posts: boolean;
};

const messages = defineMessages({
    nominate: {
        id: "chart.modding.nominate",
        message: "Nominate",
    }
})

export function ChartModding(props: {
    set: Resource<ApiChartSet | undefined>,
    chart: Accessor<ApiChart | undefined>,
    posts: ApiModdingPost[] | undefined,
    meta: MetaType | undefined
}) {
    const { set, chart, posts } = props!;
    const intl = useIntl();

    const [modders, setModders] = createSignal<ApiAccount[] | undefined>();

    createEffect(() => {
        if (posts === undefined) {
            return;
        }
        
        const modders = posts?.filter(x => x.type === ApiModdingPostType.Problem || x.type === ApiModdingPostType.Suggestion).map(x => x.author);
        const map = new Map<number, ApiAccount>();

        modders.forEach(modder => {
            if (!map.has(modder.id)) {
                map.set(modder.id, modder);
            }
        });

        setModders(Array.from(map.values()));
    });
    
    const formatter = new Intl.DateTimeFormat("en-us", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        hour12: false,
        minute: "numeric",
    });

    return <div class="chart_modding">
        <div class="chart_modding--data">
            <div class="chart_modding--data-name">{chart()?.difficulty_name}</div>
            <div class="chart_modding--data-strain" />
            <div class="chart_modding--data-mods">
                <For each={posts?.filter(x => x.attributes.timestamp !== undefined)}>
                    {post => {
                        const songLength = chart()?.statistics.music_length ?? 0;
                        const percentage = post.attributes.timestamp! / songLength;
                        switch (post.type) {
                            case ApiModdingPostType.Note:
                                return <div class="chart_modding--data-mods-bar" data-type="notes" style={{ left: `${percentage * 100}%` }} />;
                            case ApiModdingPostType.Suggestion:
                                return <div class="chart_modding--data-mods-bar" data-type="suggestions" style={{ left: `${percentage * 100}%` }} />;
                            case ApiModdingPostType.Comment:
                                return <div class="chart_modding--data-mods-bar" data-type="comments" style={{ left: `${percentage * 100}%` }} />;
                            case ApiModdingPostType.Problem:
                                return <div class="chart_modding--data-mods-bar" data-type="problems" style={{ left: `${percentage * 100}%` }} />;
                            case ApiModdingPostType.Praise:
                                return <div class="chart_modding--data-mods-bar" data-type="praises" style={{ left: `${percentage * 100}%` }} />;
                            default:
                                return <></>;
                        }
                    }}
                </For>
            </div>
        </div>
        <div class="chart_modding--info">
            <table class="chart_modding--info-table">
                <tbody>
                    <Show when={chart()?.source}>
                        <tr>
                            <td>Source</td>
                            <td>{chart()?.source}</td>
                        </tr>
                    </Show>
                    <tr>
                        <td>Genre</td>
                        <td>Unknown</td>
                    </tr>
                    <tr class="chart_modding--info-table-divisor" />
                    <tr>
                        <td>Language</td>
                        <td>Unknown</td>
                    </tr>
                    <tr>
                        <td>Tags</td>
                        <td>{chart()?.tags}</td>
                    </tr>
                    <tr class="chart_modding--info-table-divisor" />
                    <tr>
                        <td>Submitted</td>
                        <td>{formatter.format(chart()?.created_at === undefined ? new Date() : new Date(chart()!.created_at!))}</td>
                    </tr>
                    <tr>
                        <td>Updated</td>
                        <td>{formatter.format(chart()?.updated_at === undefined ? new Date() : new Date(chart()!.updated_at!))}</td>
                    </tr>
                </tbody>
            </table>
            <div class="chart_modding--info-users">
                <div class="chart_modding--info-users-charters">
                    <h1>Charters</h1>
                    <div class="chart_modding--info-users-charters-list">
                        <For each={chart()?.creators}>
                            {creator => <UserFlyout account={creator} >
                                <AccountChip account={creator} description="Host" />
                            </UserFlyout>}
                        </For>
                    </div>
                </div>
                <div class="chart_modding--info-users-charters">
                    <h1>Modders</h1>
                    <div class="chart_modding--info-users-charters-list">
                        <For each={modders()}>
                            {creator => <UserFlyout account={creator} >
                                <AccountChip account={creator} />
                            </UserFlyout>}
                        </For>
                    </div>
                </div>
            </div>
            <table class="chart_modding--info-mods">
                <tbody>
                    <tr>
                        <td />
                        <td>All</td>
                        <td>{posts?.filter(x => x.type !== ApiModdingPostType.System).length}</td>
                    </tr>
                    <tr>
                        <td style={{ color: "hsl(255, 100%, 60%)" }}><Fa icon={faClipboard} /></td>
                        <td>Notes</td>
                        <td>{posts?.filter(x => x.type === ApiModdingPostType.Note).length}</td>
                    </tr>
                    <tr>
                        <td style={{ color: "hsl(195, 100%, 60%)" }}><Fa icon={faClipboardQuestion} /></td>
                        <td>Suggestions</td>
                        <td>{posts?.filter(x => x.type === ApiModdingPostType.Suggestion).length}</td>
                    </tr>
                    <tr>
                        <td style={{ color: "hsl(0, 0%, 60%)" }}><Fa icon={faCommentAlt} /></td>
                        <td>Comments</td>
                        <td>{posts?.filter(x => x.type === ApiModdingPostType.Comment).length}</td>
                    </tr>
                    <tr>
                        <td style={{ color: "hsl(345, 100%, 60%)" }}><Fa icon={faTimesCircle} /></td>
                        <td>Problems</td>
                        <td>{posts?.filter(x => x.type === ApiModdingPostType.Problem).length}</td>
                    </tr>
                    <tr>
                        <td style={{ color: "hsl(140, 100%, 60%)" }}><Fa icon={faAtom} /></td>
                        <td>Praises</td>
                        <td>{posts?.filter(x => x.type === ApiModdingPostType.Praise).length}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="chart_modding--nominations">
            <span class="chart_modding--nominations-title">Nominations</span>
            <ChartNominationSection set={set} />
            <div class="chart_modding--nominations--buttons">
                <Show when={props.meta?.can_nominate}>
                    <button class="chart_modding--nominations--buttons-button chart_modding--nominations--buttons-button-nominate">
                        <Fa icon={faAward} />{intl.formatMessage(messages.nominate)}
                    </button>
                </Show>
            </div>
        </div>
    </div>;
}
