import { Accessor, For } from "solid-js";
import { ApiChart, ApiChartSet } from "../../structures/api/ApiChartSet";
import { Util } from "../../util/Util";

export interface ChartBackgroundProps {
    set?: ApiChartSet;
    currentChart: Accessor<ApiChart | undefined>;
}

export function ChartBackground(props: ChartBackgroundProps) {
    return (
        <div class="chart--content-details--background" style={{
            "background-image": `url(${Util.getCdnFor("backgrounds", props.set?.id)}`
        }}>
            <div class="chart--content-details--background-info">
                <div class="chart--content-details--title">{props.set?.title}</div>
                <div class="chart--content-details--artist">{props.set?.artist}</div> {/* TODO: have settings to prefer original metadata*/}
                <div class="chart--content-details--creator">
                    Created by <a href="#">{props.set?.creator.username}</a>
                </div>
            </div>
    
            <div class="chart--content-details--background-difficulties">
                <For each={props.set?.charts}>
                    {chart => <button
                        class={`chart--content-details--background-difficulty${chart.id === props.currentChart()?.id
                            ? " chart--content-details--background-difficulty-selected"
                            : ""}`}
    
                        style={{
                            background: "white"
                        }}
                    >
                        {chart.difficulty.difficulty}
                    </button>}
                </For>
    
            </div>
            <div class="chart--content-details--background-bar" style={{
                /* TODO: difficulty spectrum color */
                background: "white"
            }} />
        </div>
    );
}