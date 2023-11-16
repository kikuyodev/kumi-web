import { faHeart, faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import { Fa } from "solid-fa";
import { For } from "solid-js";
import { ApiChartSet, ApiChartSetStatus } from "../../structures/api/ApiChartSet";
import { Colors } from "../../util/Colors";
import { Util } from "../../util/Util";
import { AccountFlyout } from "../flyouts/AccountFlyout";
import "../../styles/components/charts/chartCard.scss";

export function ChartCard(props: ApiChartSet) {
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
            <div class="chart_card--content-right">
                <div class="chart_card--content-right-stats">
                    <Fa icon={faHeart} />
                    <p>19</p>
                </div>
                <div class="chart_card--content-right-stats">
                    <Fa icon={faPlayCircle} />
                    <p>368</p>
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