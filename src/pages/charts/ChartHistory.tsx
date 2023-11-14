import { For, JSX } from "solid-js";
import { ApiChartHistory, ApiChartHistoryType } from "../../structures/api/ApiChartHistory";
import "../../styles/pages/chart/chartHistory.scss";

export function ChartHistory(_props: {
    history: ApiChartHistory[] | undefined
}) {
    return <div class="chart_history">
        <For each={_props.history}>
            {v => <HistoryPoint point={v} />}
        </For>
        <div class="chart_history--line" />
    </div>;
}

export function HistoryPoint(props: {
    point: ApiChartHistory
}) {
    const formatter = new Intl.DateTimeFormat("en-us", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        hour12: false,
        minute: "numeric",
    });

    let historyElement: any;
    switch (props.point.type) {
        case ApiChartHistoryType.ChartSetNominated:
            historyElement = <>Nominated by <a href="">{props.point.player?.username}</a></>;
            break;

            case ApiChartHistoryType.ChartSetQualified:
                historyElement = <>Qualified by <a href="">{props.point.player?.username}</a></>;
                break;

                case ApiChartHistoryType.ChartSetDisqualified:
                    historyElement = <>Disqualified by <a href="">{props.point.player?.username}</a> for reason <a href="">#0</a></>;
                    break;
            
        default:
            historyElement = <></>;
            break;
    }

    return <div class="chart_history--point">
        <div class="chart_history--point-circle" />
        <div class="chart_history--point-separator" />
        <div class="chart_history--point-time">{formatter.format(props.point.created_at == undefined ? new Date() : new Date(props.point.created_at!))}</div>
        <div class="chart_history--point-separator" />
        <div class="chart_history--point-data">{historyElement}</div>
    </div>;
}