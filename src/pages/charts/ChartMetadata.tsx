import { Accessor, For, Resource, Show } from "solid-js";
import { ApiChart, ApiChartSet } from "src/structures/api/ApiChartSet";

export function ChartMetadata(props: {
    set: Resource<ApiChartSet | undefined>,
    chart: Accessor<ApiChart | undefined>
}) {
    let { set, chart } = props!;
    
    return (
        <div class="chart--content-details--body-left">
            <div class="chart--content-details--difficulty-name">{chart()?.difficulty_name}</div>
            <div class="chart--content-details--creators">
                <span>
                    {chart()?.creators.find(creator => creator.id === set()?.creator.id) !== undefined
                        ? chart()?.creators.length === 1
                            ? "Created by "
                            : "Collaboration by "
                        : chart()?.creators.length === 1
                            ? "Guest chart by "
                            : "Guest collaboration by "}
                    <For each={chart()?.creators}>
                        {(creator, idx) => {
                            let prepend = "";
                            if (chart()?.creators.length === 1) {
                                return <a href={`/accounts/${creator.id}`} class="chart--content-details--creators-creator">
                                    {creator.username}
                                </a>;
                            } else {
                                if (idx() === chart()!.creators.length - 1) {
                                    prepend = "and ";
                                } else if (idx() == 0) {
                                    // do nothing
                                } else {
                                    prepend = ", ";
                                }
                            }

                            return (
                                <>
                                    {prepend}
                                    <a href={`/accounts/${creator.id}`} class="chart--content-details--creators-creator">
                                        {creator.username}
                                    </a>;
                                </>
                            );
                        }}
                    </For>
                </span>
            </div>

            { /* Currently unused. */}
            <div class="chart--content-details--body-strain-bar" />

            <div class="chart--content-details--body-left">
                <div class="chart--content-details--body-info-container">
                    <table class="chart--content-details--information">
                        <tbody>
                            <tr>
                                <td>Creator</td>
                                <td>{set()?.creator.username}</td>
                            </tr>
                            <Show when={chart()?.source}>
                                <tr>
                                    <td>Source</td>
                                    <td>{chart()?.source}</td>
                                </tr>
                            </Show>
                            <tr>
                                <td>Genre</td>
                                <td>Unknown</td>
                            </tr>
                            <tr class="chart--content-details--information-divisor" />
                            <tr>
                                <td>Language</td>
                                <td>Unknown</td>
                            </tr>
                            <tr>
                                <td>Tags</td>
                                <td>{chart()?.tags}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="chart--content-details--body-divider" />

                    <table class="chart--content-details--information">
                        <tbody>
                            <tr>
                                <td>Creator</td>
                                <td>{set()?.creator.username}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}