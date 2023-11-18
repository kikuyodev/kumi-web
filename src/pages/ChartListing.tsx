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
    let input: HTMLInputElement | undefined = undefined;

    createEffect(() => {
        if (charts() !== undefined && charts()!.length !== 0) {
            background?.setAttribute("src", Util.getCdnFor("backgrounds", charts()![0].id ?? 0, { format: "scaled" }));

            anime({
                targets: ".chart_listing--content-list-item",
                opacity: [
                    { value: 0, duration: 0 },
                    { value: 1, duration: 1000 }
                ],
                translateY: [
                    { value: -10, duration: 0 },
                    { value: 0, duration: 1000 }
                ],
                delay: anime.stagger(50),
                easing: "easeOutExpo"
            });
        }

        input?.addEventListener("input", queryInput);
    });

    const queryInput = Util.debounce(() => {
        const value = input?.value ?? "";

        if (value.length === 0) {
            return;
        }
        
        useApi(async (access) => {
            const charts = await access.searchCharts(value);
            setCharts(charts?.data?.results ?? []);
        });
    }, 250);

    return <div class="chart_listing">
        <div class="chart_listing--background">
            <img ref={background} src="" alt="" style={{ opacity: 0 }} onLoad={(v) => {
                anime({
                    targets: v.target,
                    opacity: [
                        { value: 0, duration: 0 },
                        { value: 1, duration: 1000 }
                    ],
                    easing: "linear"
                });
            }} />
            <div class="chart_listing--background-overlay" />
        </div>
        <div class="chart_listing--content">
            <div class="chart_listing--content-list">
                <For each={charts()}>
                    {chart => <div class="chart_listing--content-list-item" style={{ opacity: 0 }}><ChartCard {...chart} /></div>}
                </For>
            </div>
            <div class="chart_listing--content-query">
                <input ref={input} type="text" placeholder="Search (title, artist, creator...)" name="query" class="chart_listing--query-text" />
                {/* TODO: other controls */}
            </div>
        </div>
    </div>;
}
