import { useParams } from "@solidjs/router";
import { For, Show, createEffect, createSignal } from "solid-js";
import { ChartBackground } from "../components/charts/ChartBackground";
import { ChartBodyTab } from "../components/charts/ChartBodyTab";
import { useApi } from "../contexts/ApiAccessContext";
import "../styles/pages/chart.scss";
import { ApiChart } from "../structures/api/ApiChartSet";
import { Util } from "../util/Util";

export function ChartPage() {
    const params = useParams();
    const set = useApi(async (access) => access.getChartSet(params.set));
    const [chart, setChart] = createSignal<ApiChart | undefined>(undefined);

    createEffect(() => {
        if (!set()) {
            return;
        }

        if (!params.chart) {
            // set the params.chart to the first chart in the set.
            window.location.href = `/chartsets/${params.set}/${set()?.charts[0].id}`;
        } else {
            // check if the chart exists in the set.
            if (!set()?.charts.find(chart => chart.id === parseInt(params.chart) ?? -1)) {
                window.location.href = `/chartsets/${params.set}/${set()?.charts[0].id}`;
            }
        }

        setChart(set()?.charts.find(chart => chart.id === parseInt(params.chart) ?? -1));
    });

    return (
        <div class="chart">
            <div class="chart--background">
                <img src={Util.getCdnFor("backgrounds", set()?.id)} alt="background" />
                <div class="chart--background-overlay" />
            </div>

            <div class="chart--content">
                <div class="chart--content-title">
                    Chart <span>Info</span>
                </div>

                <div class="chart--content-details">
                    <ChartBackground
                        set={set()}
                        currentChart={chart}
                    />

                    <div class="chart--content-details--body">
                        <div class="chart--content-details--body-tabs">
                            <ChartBodyTab href={`/chartsets/${set()?.id}/${chart()?.id}`} selected text="Chart" />
                            <ChartBodyTab href={`/chartsets/${set()?.id}/modding`} text="Modding" />
                        </div>

                        <div class="chart--content-details--body-left">
                            <div class="chart--content-details--difficulty-name">{chart()?.difficulty_name}</div>
                            <div class="chart--content-details--creators">
                                <span>
                                    {chart()?.creators.find(creator => creator.id === set()?.creator.id) !== undefined
                                        ? chart()?.creators.length === 1
                                            ? "Created by "
                                            : "Collaboration by "
                                        : chart()?.creators.length === 1
                                            ? "Guest chart by "
                                            : "Guest collaboration by "}
                                    <For each={chart()?.creators}>
                                        {(creator, idx) => {
                                            let prepend = "";
                                            if (chart()?.creators.length === 1) {
                                                return <a href={`/users/${creator.id}`} class="chart--content-details--creators-creator">
                                                    {creator.username}
                                                </a>;
                                            } else {
                                                if (idx() === chart()!.creators.length - 1) {
                                                    prepend = "and ";
                                                } else if (idx() == 0) {
                                                    // do nothing
                                                } else {
                                                    prepend = ", ";
                                                }
                                            }

                                            return (
                                                <>
                                                    {prepend}
                                                    <a href={`/users/${creator.id}`} class="chart--content-details--creators-creator">
                                                        {creator.username}
                                                    </a>;
                                                </>
                                            );
                                        }}
                                    </For>
                                </span>
                            </div>

                            { /* Currently unused. */}
                            <div class="chart--content-details--body-strain-bar" />

                            <div class="chart--content-details--body-left">
                                <div class="chart--content-details--body-info-container">
                                    <table class="chart--content-details--information">
                                        <tbody>
                                            <tr>
                                                <td>Creator</td>
                                                <td>{set()?.creator.username}</td>
                                            </tr>
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
                                            <tr class="chart--content-details--information-divisor" />
                                            <tr>
                                                <td>Language</td>
                                                <td>Unknown</td>
                                            </tr>
                                            <tr>
                                                <td>Tags</td>
                                                <td>{chart()?.tags}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <div class="chart--content-details--body-divider" />

                                    <table class="chart--content-details--information">
                                        <tbody>
                                            <tr>
                                                <td>Creator</td>
                                                <td>{set()?.creator.username}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}