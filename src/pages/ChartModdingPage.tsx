import { useParams } from "@solidjs/router";
import { createEffect, createSignal } from "solid-js";
import { ChartBackground } from "../components/charts/ChartBackground";
import { ChartBodyTab } from "../components/charts/ChartBodyTab";
import { useApi } from "../contexts/ApiAccessContext";
import { ApiChart } from "../structures/api/ApiChartSet";
import "../styles/pages/chart.scss";

export function ChartModdingPage() {
    const params = useParams();
    const set = useApi(async (access) => access.getChartSet(params.set));
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
            <div class="chart--content">
                <div class="chart--content-details">
                    <ChartBackground
                        set={set()}
                        currentChart={chart}
                    />

                    <div class="chart--content-details--body">
                        <div class="chart--content-details--body-tabs">
                            <ChartBodyTab href={`/chartsets/${set()?.id}/${chart()?.id}`}  text="Chart" />
                            <ChartBodyTab href={`/chartsets/${set()?.id}/modding`} selected text="Modding" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}