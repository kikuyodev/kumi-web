import { useParams } from "@solidjs/router";
import { createEffect, createSignal } from "solid-js";
import { ChartModding } from "./charts/ChartModding";
import { ChartBackground } from "../components/charts/ChartBackground";
import { SegmentedControl } from "../components/controls/SegmentedControl";
import { useApi } from "../contexts/ApiAccessContext";
import { ApiChart } from "../structures/api/ApiChartSet";
import "../styles/pages/chart.scss";
import { Util } from "../util/Util";

export function ChartModdingPage() {
    const params = useParams();
    const set = useApi(async (access) => access.getChartSet(params.set));
    const posts = useApi(async (access) => access.getModdingPosts(params.set));
    const [chart, setChart] = createSignal<ApiChart | undefined>(undefined);

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
                        <ChartModding set={set} chart={chart} posts={posts} />
                    </div>
                </div>
            </div>
        </div>
    );
}