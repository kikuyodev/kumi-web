import { useParams } from "@solidjs/router";
import { Match, Switch, createEffect, createSignal } from "solid-js";
import { ChartModding } from "./charts/ChartModding";
import { GeneralModding } from "./charts/GeneralModding";
import { ChartBackground } from "../components/charts/ChartBackground";
import { SegmentedControl } from "../components/controls/SegmentedControl";
import { useApi } from "../contexts/ApiAccessContext";
import { ApiChart } from "../structures/api/ApiChartSet";
import "../styles/pages/chart.scss";
import { Util } from "../util/Util";
import { ChartHistory } from "./charts/ChartHistory";

export function ChartModdingPage() {
    const params = useParams();
    const set = useApi(async (access) => access.getChartSet(params.set));
    const data = useApi(async (access) => access.getModdingData(params.set));
    const [chart, setChart] = createSignal<ApiChart | undefined>(undefined);
    const [section, setSection] = createSignal<"general" | "chart" | "history">("general");

    createEffect(() => {
        if (!set()) {
            return;
        }

        if (chart() === undefined) {
            // set the chart to the first chart in the set.
            setChart(set()?.charts[0]);
        }
    });

    return (
        <div class="chart">
            <div class="chart--background">
                <img src={Util.getCdnFor("backgrounds", set()?.id, { format: "background" })} alt="background" />
                <div class="chart--background-overlay" />
            </div>
            <div class="chart--content">
                <div class="chart--content-title">
                    Chart <span>Modding</span>
                </div>
                <div class="chart--content-details">
                    <ChartBackground
                        set={set()}
                        currentChart={chart}
                    />
                    <div class="chart--content-details--body">
                        <SegmentedControl options={["Chart", "Modding"]} selected={"Modding"} onChange={v => {
                            if (v === "Modding") {
                                return;
                            }

                            window.location.href = `/chartsets/${params.set}/${chart()?.id}`;
                        }} />
                        <ChartModding set={set} chart={chart} posts={data()?.posts.filter(x => !x.has_parent)} />
                    </div>
                </div>
                <div class="chart--content-modding">
                    <SegmentedControl options={["General (All difficulties)", "General (This difficulty)", "History"]} selected="General (All difficulties)" onChange={v => {
                        switch (v) {
                            case "General (All difficulties)":
                                setSection("general");
                                break;
                            case "General (This difficulty)":
                                setSection("chart");
                                break;
                            case "History":
                                setSection("history");
                                break;
                        }
                    }} />
                    <Switch fallback={<div>Not found</div>}>
                        <Match when={section() === "general"}>
                            <GeneralModding set={set} posts={data()?.posts.filter(x => !x.has_parent)} />
                        </Match>
                        <Match when={section() === "chart"}>
                            <div>Chart</div>
                        </Match>
                        <Match when={section() === "history"}>
                            <ChartHistory history={data()?.events} />
                        </Match>
                    </Switch>
                </div>
            </div>
        </div>
    );
}