import anime from "animejs";
import { For, createEffect, createSignal } from "solid-js";
import { ChartCard } from "../components/charts/ChartCard";
import { useApi } from "../contexts/ApiAccessContext";
import { ApiChartSet } from "../structures/api/ApiChartSet";
import "../styles/pages/chartListing.scss";
import { Util } from "../util/Util";

export function ChartListing() {
    const [charts, setCharts] = createSignal<ApiChartSet[]>();

    let background: HTMLImageElement | undefined = undefined;

    createEffect(() => {
        if (charts()!.length === 0) {
            return;
        }

        background?.setAttribute("src", Util.getCdnFor("backgrounds", charts()![0].id ?? 0, { format: "scaled" }));
    });

    useApi(async (access) => {
        const charts = await access.searchCharts("bpm==195");
        setCharts(charts?.data?.results ?? []);
    });

    return <div class="chart_listing">
        <div class="chart_listing--background">
            <img ref={background} src="" alt="" style={{ opacity: 0 }} onLoad={(v) => {
                anime({
                    targets: v.target,
                    opacity: [
                        { value: 0, duration: 0 },
                        { value: 1, duration: 1000 }
                    ],
                    easing: "easeOutExpo"
                });
            }} />
            <div class="chart_listing--background-overlay" />
        </div>
        <div class="chart_listing--content">
            <div class="chart_listing--content-list">
                <For each={charts()}>
                    {chart => <div class="chart_listing--content-list-item"><ChartCard {...chart} /></div>}
                </For>
                <For each={charts()}>
                    {chart => <div class="chart_listing--content-list-item"><ChartCard {...chart} /></div>}
                </For>
            </div>
            <div class="chart_listing--content-query">
                <input type="text" placeholder="Search (title, artist, creator...)" name="query" class="chart_listing--query-text" />
                {/* TODO: other controls */}
            </div>
        </div>
    </div>;
}