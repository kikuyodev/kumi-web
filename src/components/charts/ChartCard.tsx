import { faDownload, faHeart, faPause, faPlay, faPlayCircle, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { Fa } from "solid-fa";
import { For, Show, createEffect, createSignal, onMount } from "solid-js";
import { ApiChartSet, ApiChartSetStatus } from "../../structures/api/ApiChartSet";
import { Colors } from "../../util/Colors";
import { Util } from "../../util/Util";
import { AccountFlyout } from "../flyouts/AccountFlyout";
import "../../styles/components/charts/chartCard.scss";
import anime from "animejs";
import { useGlobalAudio } from "../../contexts/AudioContext";
import { Song } from "../../structures/GlobalAudio";
import { Portal } from "solid-js/web";

export function ChartCard(props: {
    chart: ApiChartSet;
    expanded?: boolean;
}) {
    const [controlsVisible, setControlsVisible] = createSignal(false);

    let card: HTMLDivElement | undefined = undefined;
    let statistics: HTMLDivElement | undefined = undefined;
    let controls: HTMLDivElement | undefined = undefined;
    let expandedCard: HTMLDivElement | undefined = undefined;

    onMount(() => {
        expandedCard?.style.setProperty("display", "none");
        expandedCard?.style.setProperty("position", "absolute");
        expandedCard?.style.setProperty("z-index", "10000");
    });

    createEffect(() => {
        anime({
            targets: statistics,
            opacity: [
                { value: controlsVisible() ? 1 : 0, duration: 0 },
                { value: controlsVisible() ? 0 : 1, duration: 200 }
            ],
            easing: "linear"
        });

        anime({
            targets: controls,
            opacity: [
                { value: controlsVisible() ? 0 : 1, duration: 0 },
                { value: controlsVisible() ? 1 : 0, duration: 200 }
            ],
            easing: "linear"
        });
    });

    return <a ref={card} class={`chart_card ${props.expanded ? "chart_card--expanded" : ""}`} href={`/chartsets/${props.chart.id}`}>
        <div class="chart_card--background">
            <img src={Util.getCdnFor("backgrounds", props.chart.id, { format: "card" })} alt="" />
            <div class="chart_card--background-overlay" />
            <Show when={props.expanded}>
                <div class="chart_card--background-overlay-expanded" />
            </Show>
        </div>
        <div class="chart_card--content">
            <div class="chart_card--content-left">
                <div class="chart_card--content-left-info">
                    <div class="chart_card--content-left-info-title">{props.chart.title}</div>
                    <div class="chart_card--content-left-info-artist">{props.chart.artist}</div>
                    <div class="chart_card--content-left-info-charter">
                        <p>Charted by</p>
                        <AccountFlyout account={props.chart.creator}>
                            <a href={`/accounts/${props.chart.creator.id}`}>{props.chart.creator.username}</a>
                        </AccountFlyout>
                    </div>
                </div>
                <Show when={!props.expanded}>
                    <div class="chart_card--content-left-charts"
                        onMouseEnter={() => {
                            expandedCard?.style.setProperty("display", "block");

                            const rect = card!.getBoundingClientRect();
                            const x = rect.left;
                            const y = rect.top;

                            expandedCard?.style.setProperty("left", `${x}px`);
                            expandedCard?.style.setProperty("top", `${y + window.scrollY}px`);
                            expandedCard?.style.setProperty("width", `${rect.width}px`);
                        }}
                    >
                        <For each={props.chart.charts}>
                            {chart => <div class="chart_card--content-left-charts-chart" style={{ "background-color": Colors.difficultyColorFor(chart.difficulty.difficulty) }} />}
                        </For>
                        <Portal ref={expandedCard} mount={document.body}>
                            <div class="chart_card--content-left-charts-expanded" onMouseLeave={() => {
                                expandedCard?.style.setProperty("display", "none");
                            }}>
                                <ChartCard {...props} expanded={true} />
                            </div>
                        </Portal>
                    </div>
                </Show>
                <Show when={props.expanded}>
                    <div class="chart_card--content-left-charts_expanded">
                        <For each={props.chart.charts}>
                            {chart =>
                                <div class="chart_card--content-left-charts_expanded-chart">
                                    <div class="chart_card--content-left-charts_expanded-chart-difficulty" style={{ "background-color": Colors.difficultyColorFor(chart.difficulty.difficulty), color: Colors.difficultyTextColorFor(chart.difficulty.difficulty) }}>{chart.difficulty.difficulty.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                    <p>{chart.difficulty_name}</p>
                                </div>
                            }
                        </For>
                    </div>
                </Show>
            </div>
            <div class="chart_card--content-right" onMouseEnter={() => {
                setControlsVisible(true);
            }} onMouseLeave={() => {
                setControlsVisible(false);
            }}>
                <div ref={statistics} class="chart_card--content-right-statistics">
                    <div class="chart_card--content-right-stats">
                        <Fa icon={faHeart} />
                        <p>19</p>
                    </div>
                    <div class="chart_card--content-right-stats">
                        <Fa icon={faPlayCircle} />
                        <p>368</p>
                    </div>
                </div>
                <div ref={controls} class="chart_card--content-right-controls" style={{ opacity: 0 }}>
                    <button class="chart_card--content-right-controls-control">
                        <Fa icon={faDownload} />
                    </button>
                    <PlayButton {...props.chart} />
                </div>
                <div class="chart_card--content-right-status" data-status={ApiChartSetStatus[props.chart.status].toLowerCase()}>{getReadableName(props.chart.status)}</div>
            </div>
        </div>
    </a>;
}

function getReadableName(status: ApiChartSetStatus) {
    switch (status) {
        case ApiChartSetStatus.WorkInProgress:
            return "WIP";
        case ApiChartSetStatus.Pending:
            return "Pending";
        case ApiChartSetStatus.Ranked:
            return "Ranked";
        case ApiChartSetStatus.Qualified:
            return "Qualified";
        case ApiChartSetStatus.Graveyard:
            return "Graveyard";
    }

    return "Unknown";
}

function PlayButton(props: ApiChartSet) {
    const audio = useGlobalAudio();

    const [playing, setPlaying] = createSignal(false);
    const [loading, setLoading] = createSignal(true);

    let cachedSong: Song | undefined = undefined;

    let button: HTMLButtonElement | undefined = undefined;
    let progress: SVGCircleElement | undefined = undefined;

    createEffect(() => {
        if (playing()) {
            if (!cachedSong) {
                audio.play(Util.getCdnFor("previews", props.id)).then(song => {
                    cachedSong = song;
                    setLoading(false);
                    progress?.style.setProperty("stroke-width", "1px");

                    cachedSong?.on("progress", (p) => {
                        progress?.style.setProperty("stroke-dasharray", `${p * 44} 44`);
                    });

                    cachedSong?.on("stop", () => {
                        setPlaying(false);
                        progress?.style.setProperty("stroke-width", "0px");
                        progress?.style.setProperty("stroke-dasharray", "0 44");
                        cachedSong?.destroy();
                        cachedSong = undefined;
                    });
                });
            } else {
                cachedSong.play();
            }
        } else {
            if (cachedSong) {
                audio.pause();
            }
        }
    });

    return <button ref={button} class="chart_card--content-right-controls-control" onClick={(v) => {
        v.preventDefault();
        setPlaying(!playing());
    }}>
        <svg class="chart_card--content-right-controls-control-border" viewBox="0 0 20 20">
            <defs>
                <linearGradient id="paint0_linear_9_9" x1="9" y1="0" x2="9" y2="18" gradientUnits="accountSpaceOnUse">
                    <stop stop-color="#99E6FF" />
                    <stop offset="1" stop-color="#66D9FF" />
                </linearGradient>
            </defs>
            <circle ref={progress} cx="10" cy="10" r="7" stroke="url(#paint0_linear_9_9)" fill-opacity={0} />
        </svg>
        <Show when={playing()}>
            <Show when={loading()}>
                <Fa icon={faSyncAlt} spin={true} />
            </Show>
            <Show when={!loading()}>
                <Fa icon={faPause} />
            </Show>
        </Show>
        <Show when={!playing()}>
            <Fa icon={faPlay} />
        </Show>
    </button>;
}