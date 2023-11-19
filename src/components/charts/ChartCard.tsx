import { faDownload, faHeart, faPause, faPlay, faPlayCircle, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { Fa } from "solid-fa";
import { For, Show, createEffect, createSignal } from "solid-js";
import { ApiChartSet, ApiChartSetStatus } from "../../structures/api/ApiChartSet";
import { Colors } from "../../util/Colors";
import { Util } from "../../util/Util";
import { AccountFlyout } from "../flyouts/AccountFlyout";
import "../../styles/components/charts/chartCard.scss";
import anime from "animejs";
import { useGlobalAudio } from "../../contexts/AudioContext";
import { Song } from "../../structures/GlobalAudio";

export function ChartCard(props: ApiChartSet) {
    const [controlsVisible, setControlsVisible] = createSignal(false);

    let statistics: HTMLDivElement | undefined = undefined;
    let controls: HTMLDivElement | undefined = undefined;

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

    return <a class="chart_card" href={`/chartsets/${props.id}`}>
        <div class="chart_card--background">
            <img src={Util.getCdnFor("backgrounds", props.id, { format: "card" })} alt="" />
            <div class="chart_card--background-overlay" />
        </div>
        <div class="chart_card--content">
            <div class="chart_card--content-left">
                <div class="chart_card--content-left-info">
                    <div class="chart_card--content-left-info-title">{props.title}</div>
                    <div class="chart_card--content-left-info-artist">{props.artist}</div>
                    <div class="chart_card--content-left-info-charter">
                        <p>Charted by</p>
                        <AccountFlyout account={props.creator}>
                            <a href={`/users/${props.creator.id}`}>{props.creator.username}</a>
                        </AccountFlyout>
                    </div>
                </div>
                <div class="chart_card--content-left-charts">
                    <For each={props.charts}>
                        {chart => <div class="chart_card--content-left-charts-chart" style={{ "background-color": Colors.difficultyColorFor(chart.difficulty.difficulty) }} />}
                    </For>
                </div>
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
                    <PlayButton {...props} />
                </div>
                <div class="chart_card--content-right-status" data-status={ApiChartSetStatus[props.status].toLowerCase()}>{getReadableName(props.status)}</div>
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
                <linearGradient id="paint0_linear_9_9" x1="9" y1="0" x2="9" y2="18" gradientUnits="userSpaceOnUse">
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