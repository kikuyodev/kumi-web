import { useParams } from "@solidjs/router";
import { createEffect, createSignal } from "solid-js";
import { ChartMetadata } from "./charts/ChartMetadata";
import { ChartBackground } from "../components/charts/ChartBackground";
import { CommentMeta, Comments } from "../components/Comments";
import { SegmentedControl } from "../components/controls/SegmentedControl";
import { useApi } from "../contexts/ApiAccessContext";
import { ApiChart } from "../structures/api/ApiChartSet";
import { ApiComment } from "../structures/api/ApiComment";
import { Util } from "../util/Util";
import "../styles/pages/chart.scss";

export function ChartPage() {
    const params = useParams();
    const set = useApi(async (access) => access.chart.getChartSet(params.set));
    const comments = useApi(async (access) => access.chart.getChartSetComments(params.set));
    const [chart, setChart] = createSignal<ApiChart | undefined>(undefined);

    createEffect(() => {
        if (!set()) {
            return;
        }

        if (!params.chart) {
            // set the params.chart to the first chart in the set.
            window.location.href = `/chartsets/${params.set}/${set()?.charts[0].id}`;
        } else {
            // check if the chart exists in the set.
            if (!set()?.charts.find(chart => chart.id === parseInt(params.chart) ?? -1)) {
                window.location.href = `/chartsets/${params.set}/${set()?.charts[0].id}`;
            }
        }

        setChart(set()?.charts.find(chart => chart.id === parseInt(params.chart) ?? -1));
    });

    return (
        <div class="chart">
            <div class="chart--background">
                <img src={Util.getCdnFor("backgrounds", set()?.id, { format: "background" })} alt="background" />
                <div class="chart--background-overlay" />
            </div>
            <div class="chart--content">
                <div class="chart--content-title">
                    Chart <span>Info</span>
                </div>
                <div class="chart--content-details">
                    <ChartBackground
                        set={set()}
                        currentChart={chart}
                    />
                    <div class="chart--content-details--body">
                        <SegmentedControl options={["Chart", "Modding"]} selected={"Chart"} onChange={v => {
                            if (v === "Chart"){
                                return;
                            }

                            window.location.href = `/chartsets/${params.set}/modding`;
                        }} />
                        <ChartMetadata set={set} chart={chart} />
                    </div>
                </div>
                <Comments comments={comments()?.data?.comments} meta={comments()?.meta as CommentMeta} actions={
                    {
                        createComment: async (message: string, parent?: ApiComment) => {
                            useApi(async (access) => {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                let body: any = {
                                    message: message
                                };

                                if (parent) {
                                    body.parent = parent.id;
                                }
                                
                                const result = await access.chart.sendChartSetComment(params.set, body);
        
                                if (result) {
                                    window.location.reload();
                                }
                            });
                        },
                        editComment: async (comment: ApiComment, message: string) => {
                            useApi(async (access) => {
                                const result = await access.chart.editChartSetComment(params.set, comment.id, message);
        
                                if (result) {
                                    window.location.reload();
                                }
                            });
                        },
                        deleteComment: async (comment: ApiComment) => {
                            useApi(async (access) => {
                                const result = await access.chart.deleteChartSetComment(params.set, comment.id);
        
                                if (result) {
                                    window.location.reload();
                                }
                            });
                        },
                        pinComment: async (comment: ApiComment) => {
                            useApi(async (access) => {
                                const result = await access.chart.pinChartSetComment(params.set, comment.id);
        
                                if (result) {
                                    window.location.reload();
                                }
                            });
                        }
                    }
                } />
            </div>
        </div>
    );
}