import { Accessor, For } from "solid-js";
import { ApiChart, ApiChartSet } from "../../structures/api/ApiChartSet";
import { Colors } from "../../util/Colors";
import { Util } from "../../util/Util";
import "../../styles/components/charts/chartBackground.scss";
import { AccountFlyout } from "../flyouts/AccountFlyout";

export interface ChartBackgroundProps {
    set?: ApiChartSet;
    currentChart: Accessor<ApiChart | undefined>;
}

export function ChartBackground(props: ChartBackgroundProps) {
    return (
        <div class="chart_background">
            <div class="chart_background--background">
                <img src={Util.getCdnFor("backgrounds", props.set?.id, { format: "chartinfo" })} alt="chartinfo background" loading="lazy" />
                <div class="chart_background--background-overlay" />
            </div>
            <div class="chart_background--info">
                <div class="chart_background--info-title">{props.set?.title}</div>
                <div class="chart_background--info-artist">{props.set?.artist}</div> {/* TODO: have settings to prefer original metadata*/}
                <div class="chart_background--info-creator">
                    Created by
                    <AccountFlyout account={props.set?.creator}>
                        <a href={`/users/${props.set?.creator.id}`}>{props.set?.creator.username}</a>
                    </AccountFlyout>
                </div>
            </div>
            <div class="chart_background--difficulties">
                <For each={props.set?.charts}>
                    {chart => <button
                        class={`chart_background--difficulties-difficulty ${chart.id === props.currentChart()?.id
                            ? "chart_background--difficulties-difficulty-selected"
                            : ""}`}
                        style={{
                            background: Colors.difficultyColorFor(props.currentChart()?.difficulty.difficulty ?? 0),
                            color: Colors.difficultyTextColorFor(props.currentChart()?.difficulty.difficulty ?? 0)
                        }}
                    >
                        {(props.currentChart()?.difficulty.difficulty ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </button>}
                </For>
            </div>
            <div class="chart_background--bar" style={{
                background: Colors.difficultyColorFor(props.currentChart()?.difficulty.difficulty ?? 0)
            }} />
        </div >
    );
}