import { For } from "solid-js";
import { ApiChartHistory, ApiChartHistoryType } from "../../structures/api/ApiChartHistory";
import "../../styles/pages/chart/chartHistory.scss";

export function ChartHistory(_props: {
    history: ApiChartHistory[] | undefined
}) {
    return <div class="chart_history">
        <For each={_props.history}>
            {v => <HistoryPoint point={v} />}
        </For>
        <HistoryPoint point={{ id: 0, type: ApiChartHistoryType.ChartAdded }} />
        <HistoryPoint point={{ id: 0, type: ApiChartHistoryType.ChartRemoved }} />
        <HistoryPoint point={{ id: 0, type: ApiChartHistoryType.ChartSetDisqualified }} />
        <HistoryPoint point={{ id: 0, type: ApiChartHistoryType.ChartSetNominated }} />
        <HistoryPoint point={{ id: 0, type: ApiChartHistoryType.ChartSetQualified }} />
        <HistoryPoint point={{ id: 0, type: ApiChartHistoryType.ChartSetRanked }} />
        <HistoryPoint point={{ id: 0, type: ApiChartHistoryType.ChartSetUnranked }} />
        <HistoryPoint point={{ id: 0, type: ApiChartHistoryType.MetadataChanged }} />
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

    function readableName() {
        switch (props.point.type) {
        case ApiChartHistoryType.MetadataChanged: return "Metadata changed";
        case ApiChartHistoryType.ChartAdded: return "Chart added";
        case ApiChartHistoryType.ChartRemoved: return "Chart removed";

        case ApiChartHistoryType.ChartSetNominated: return "Chart set nominated";
        case ApiChartHistoryType.ChartSetQualified: return "Chart set qualified";
        case ApiChartHistoryType.ChartSetDisqualified: return "Chart set disqualified";
        case ApiChartHistoryType.ChartSetRanked: return "Chart set ranked";
        case ApiChartHistoryType.ChartSetUnranked: return "Chart set unranked";
        default: return "Unknown";
        }
    }

    return <div class="chart_history--point">
        <div class="chart_history--point-circle" />
        <div class="chart_history--point-separator" />
        <div class="chart_history--point-time">{formatter.format(props.point.created_at == undefined ? new Date() : new Date(props.point.created_at!))}</div>
        <div class="chart_history--point-separator" />
        <div class="chart_history--point-data">{readableName()}</div>
    </div>;
}