import anime from "animejs";
import { Pagination } from "../components/Pagination";
import { useApi } from "../contexts/ApiAccessContext";
import { useSearchParams } from "@solidjs/router";
import { For, createEffect, createSignal } from "solid-js";
import { ApiAccount } from "../structures/api/ApiAccount";
import { PaginationMeta } from "../util/api/ApiResponse";
import { EmojiUtil } from "../util/EmojiUtil";
import "../styles/pages/rankings.scss";
import Fa from "solid-fa";
import { faCaretDown, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { AccountFlyout } from "../components/flyouts/AccountFlyout";

export function Rankings() {
    const [searchParams] = useSearchParams();

    const [rankings, setRankings] = createSignal<ApiAccount[] | undefined>(undefined);
    const [meta, setMeta] = createSignal<PaginationMeta | undefined>(undefined);

    createEffect(() => {
        useApi(async api => {
            const rankings = await api.getRankings(parseInt(searchParams.page ?? "1"));

            setRankings(rankings?.data?.rankings ?? []);
            setMeta(rankings?.parseMeta<PaginationMeta>() ?? undefined);
        });
    });

    return <div class="rankings">
        <div class="rankings--background">
            <img src="" alt="" style={{ opacity: 0 }} onLoad={(v) => {
                anime({
                    targets: v.target,
                    opacity: [
                        { value: 0, duration: 0 },
                        { value: 1, duration: 1000 }
                    ],
                    easing: "linear"
                });
            }} />
            <div class="rankings--background-overlay" />
        </div>
        <div class="rankings--header">
            <h1>Rankings</h1>
            <p>•</p>
            <p>Global</p>
        </div>
        <div class="rankings--content">
            <div class="rankings--content-controls">
                <div class="rankings--content-controls-group">
                    <h1>Country</h1>
                    <div class="rankings--content-controls-group-dropdown">
                        <p>All</p>
                        <Fa icon={faCaretDown} />
                    </div>
                </div>
                <div class="rankings--content-controls-group">
                    <h1>Page</h1>
                    <div class="rankings--content-controls-group-pagination">
                        <Pagination meta={meta} requestPage={(p) => {
                            useApi(async api => {
                                const rankings = await api.getRankings(p);

                                setRankings(rankings?.data?.rankings ?? []);
                                setMeta(rankings?.parseMeta<PaginationMeta>() ?? undefined);

                                // change url but don't reload
                                window.history.pushState({}, "", `/rankings?page=${p}`);

                                // scroll to top
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            });
                        }} />
                    </div>
                </div>
            </div>
            <div class="rankings--content-body">
                <table>
                    <thead>
                        <tr>
                            <th />
                            <th style={{ width: "100%" }} />
                            <th style={{ "min-width": "120px", color: "hsl(var(--base-hue), 15%, 40%)" }}>Play count</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        <For each={rankings()}>
                            {(v, i) => <tr>
                                <td class="rankings--content-body-ranking">{i() + 1}</td>
                                <td class="rankings--content-body-username">
                                    <p>
                                        <a href={`/accounts/${v.id}`}>
                                            <AccountFlyout account={v}>
                                                {v.username}
                                            </AccountFlyout>
                                        </a>
                                    </p>
                                    { /* eslint-disable-next-line solid/no-innerhtml */}
                                    <div class="rankings--content-body-country" innerHTML={EmojiUtil.getFlagEmoji(v.country.code)} />
                                </td>
                                <td class="rankings--content-body-playcount">{v.statistics.total_playcount}</td>
                                <td class="rankings--content-body-score">{v.statistics.total_score}</td>
                            </tr>}
                        </For>
                    </tbody>
                </table>
            </div>
            <div class="rankings--content-pagination">
                <Pagination meta={meta} requestPage={(p) => {
                    useApi(async api => {
                        const rankings = await api.getRankings(p);

                        setRankings(rankings?.data?.rankings ?? []);
                        setMeta(rankings?.parseMeta<PaginationMeta>() ?? undefined);

                        // change url but don't reload
                        window.history.pushState({}, "", `/rankings?page=${p}`);

                        // scroll to top
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    });
                }} />
            </div>
        </div>
    </div>;
}
