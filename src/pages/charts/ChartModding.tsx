import { faAtom, faClipboard, faClipboardQuestion, faCommentAlt, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { Fa } from "solid-fa";
import { Accessor, For, Resource, Show } from "solid-js";
import { ApiChart, ApiChartSet } from "src/structures/api/ApiChartSet";
import { ApiModdingPost, ApiModdingPostType } from "../../structures/api/ApiModdingPost";
import "../../styles/pages/chart/moddingPanel.scss";

export function ChartModding(props: {
    set: Resource<ApiChartSet | undefined>,
    chart: Accessor<ApiChart | undefined>,
    posts: Resource<ApiModdingPost[] | undefined>
}) {
    const { set: _set, chart, posts } = props!;

    return <div class="chart_modding">
        <div class="chart_modding--data">
            <div class="chart_modding--data-name">{chart()?.difficulty_name}</div>
            <div class="chart_modding--data-strain" />
            <div class="chart_modding--data-mods">
                <span class="chart_modding--data-mods-bar" data-type="notes" style={{left: "10%"}} />
                <span class="chart_modding--data-mods-bar" data-type="suggestions" style={{left: "20%"}} />
                <span class="chart_modding--data-mods-bar" data-type="comments" style={{left: "30%"}} />
                <span class="chart_modding--data-mods-bar" data-type="problems" style={{left: "40%"}} />
                <span class="chart_modding--data-mods-bar" data-type="praises" style={{left: "50%"}} />
            </div>
        </div>
        <div class="chart_modding--info">
            <table class="chart_modding--info-table">
                <tbody>
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
                    <tr class="chart_modding--info-table-divisor" />
                    <tr>
                        <td>Language</td>
                        <td>Unknown</td>
                    </tr>
                    <tr>
                        <td>Tags</td>
                        <td>{chart()?.tags}</td>
                    </tr>
                    <tr class="chart_modding--info-table-divisor" />
                    <tr>
                        <td>Submitted</td>
                        <td>{chart()?.created_at?.toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td>Updated</td>
                        <td>{chart()?.updated_at?.toLocaleString()}</td>
                    </tr>
                </tbody>
            </table>
            <div class="chart_modding--info-users">
                <div class="chart_modding--info-users-charters">
                    <h1>Charters</h1>
                    <div class="chart_modding--info-users-charters-list">
                        <For each={chart()?.creators}>
                            {creator => <a class="chart_modding--info-users-charters-list--user" href={`/users/${creator.id}`}>
                                <div class="chart_modding--info-users-charters-list--user-avatar">
                                    <img src={`${import.meta.env.KUMI_API_URL}cdn/avatars/${creator.id}`} alt="" loading="lazy" />
                                </div>
                                <div class="chart_modding--info-users-charters-list--user-info">
                                    <h1>{creator.username}</h1>
                                    <p>Host</p>
                                </div>
                            </a>}
                        </For>
                    </div>
                </div>
                <div class="chart_modding--info-users-charters">
                    <h1>Modders</h1>
                    <div class="chart_modding--info-users-charters-list">
                        <For each={posts()?.filter(x => x.type === ApiModdingPostType.Problem || x.type === ApiModdingPostType.Suggestion).map(x => x.author)}>
                            {creator => <a class="chart_modding--info-users-charters-list--user" href={`/users/${creator.id}`}>
                                <div class="chart_modding--info-users-charters-list--user-avatar">
                                    <img src={`${import.meta.env.KUMI_API_URL}cdn/avatars/${creator.id}`} alt="" loading="lazy" />
                                </div>
                                <div class="chart_modding--info-users-charters-list--user-info">
                                    <h1>{creator.username}</h1>
                                    <p>{/* TODO: resolved / unresolved problems */}</p>
                                </div>
                            </a>}
                        </For>
                    </div>
                </div>
            </div>
            <table class="chart_modding--info-mods">
                <tbody>
                    <tr>
                        <td />
                        <td>All</td>
                        <td>{posts()?.filter(x => x.type !== ApiModdingPostType.System).length}</td>
                    </tr>
                    <tr>
                        <td style={{ color: "hsl(255, 100%, 60%)" }}><Fa icon={faClipboard} /></td>
                        <td>Notes</td>
                        <td>{posts()?.filter(x => x.type === ApiModdingPostType.Note).length}</td>
                    </tr>
                    <tr>
                        <td style={{ color: "hsl(195, 100%, 60%)" }}><Fa icon={faClipboardQuestion} /></td>
                        <td>Suggestions</td>
                        <td>{posts()?.filter(x => x.type === ApiModdingPostType.Suggestion).length}</td>
                    </tr>
                    <tr>
                        <td style={{ color: "hsl(0, 0%, 60%)" }}><Fa icon={faCommentAlt} /></td>
                        <td>Comments</td>
                        <td>{posts()?.filter(x => x.type === ApiModdingPostType.Comment).length}</td>
                    </tr>
                    <tr>
                        <td style={{ color: "hsl(345, 100%, 60%)" }}><Fa icon={faTimesCircle} /></td>
                        <td>Problems</td>
                        <td>{posts()?.filter(x => x.type === ApiModdingPostType.Problem).length}</td>
                    </tr>
                    <tr>
                        <td style={{ color: "hsl(140, 100%, 60%)" }}><Fa icon={faAtom} /></td>
                        <td>Praises</td>
                        <td>{posts()?.filter(x => x.type === ApiModdingPostType.Praise).length}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>;
}