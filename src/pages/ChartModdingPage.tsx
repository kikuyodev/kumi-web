import { useParams } from "@solidjs/router";
import { Match, Switch, createEffect, createSignal } from "solid-js";
import { ChartHistory } from "./charts/ChartHistory";
import { ChartModding } from "./charts/ChartModding";
import { GeneralModding } from "./charts/GeneralModding";
import { ChartBackground } from "../components/charts/ChartBackground";
import { SegmentedControl } from "../components/controls/SegmentedControl";
import { useApi } from "../contexts/ApiAccessContext";
import { ApiChart } from "../structures/api/ApiChartSet";
import "../styles/pages/chart.scss";
import { Util } from "../util/Util";
import anime from "animejs";

type MetaType = {
    can_nominate: boolean;
    can_moderate_posts: boolean;
};

export function ChartModdingPage() {
    const params = useParams();
    const set = useApi(async (access) => access.chart.getChartSet(params.set));
    const data = useApi(async (access) => access.modding.getModdingData(params.set));
    const [chart, setChart] = createSignal<ApiChart | undefined>(undefined);
    const [section, setSection] = createSignal<"general" | "chart" | "history" | "timeline">("general");

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
                <img src={Util.getCdnFor("backgrounds", set()?.id, { format: "background" })} alt="background" style={{ opacity: 0 }} onLoad={(v) => {
                    anime({
                        targets: v.target,
                        opacity: [
                            { value: 0, duration: 0 },
                            { value: 1, duration: 1000 }
                        ],
                        easing: "linear"
                    });
                }} />
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
                        <ChartModding set={set} chart={chart} posts={data()?.data?.posts.filter(x => !x.has_parent)} meta={data()?.meta as MetaType} />
                    </div>
                </div>
                <div class="chart--content-modding">
                    <SegmentedControl options={["General (All difficulties)", "General (This difficulty)", "Timeline", "History"]} selected="General (All difficulties)" onChange={v => {
                        switch (v) {
                            case "General (All difficulties)":
                                setSection("general");
                                break;
                            case "General (This difficulty)":
                                setSection("chart");
                                break;
                            case "Timeline":
                                setSection("timeline");
                                break;
                            case "History":
                                setSection("history");
                                break;
                        }
                    }} />
                    <Switch fallback={<div>Not found</div>}>
                        <Match when={section() === "general"}>
                            { /* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            <GeneralModding set={set} posts={data()?.data?.posts.filter(x => !x.has_parent)} meta={data()?.meta as any} />
                        </Match>
                        <Match when={section() === "chart"}>
                            { /* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            <GeneralModding chart={chart} set={set} posts={data()?.data?.posts.filter(x => x.chart?.id == chart()?.id)} meta={data()?.meta as any} isTimeline={false} />
                        </Match>
                        <Match when={section() === "timeline"}>
                            { /* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            <GeneralModding chart={chart} set={set} posts={data()?.data?.posts.filter(x => x.attributes.timestamp !== undefined && x.chart?.id == chart()?.id)} meta={data()?.meta as any} isTimeline={true} />
                        </Match>
                        <Match when={section() === "history"}>
                            <ChartHistory history={data()?.data?.events} />
                        </Match>
                    </Switch>
                </div>
            </div>
        </div>
    );
}