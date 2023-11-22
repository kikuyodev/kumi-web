import { useParams } from "@solidjs/router";
import { useApi } from "../contexts/ApiAccessContext";
import { For, createMemo } from "solid-js";
import { Markdown } from "../components/markup/Markdown";
import "../styles/pages/wiki.scss";

export function Wiki() {
    const params = useParams();
    const article = useApi(async api => await api.getWikiPage(params.language, params.page));

    const toc = createMemo(() => {
        if (article() === undefined) {
            return [];
        }

        // The article doesn't provide use with a table of contents, so we have to generate one ourselves from the markdown.
        const toc = [];

        let currentType = 0;
        let currentTitle = "";
        let currentId = 0;

        for (const line of article()!.content.split("\n")) {
            if (line.startsWith("#")) {
                const type = line.match(/^(#+)/)![0].length;

                if (type > currentType) {
                    // We're going deeper into the table of contents.
                    currentTitle = line.replace(/^(#+)\s*/, "");
                    currentId++;
                } else if (type < currentType) {
                    // We're going back up the table of contents.
                    currentTitle = line.replace(/^(#+)\s*/, "");
                    currentId--;
                } else {
                    // We're staying on the same level.
                    currentTitle = line.replace(/^(#+)\s*/, "");
                }

                currentType = type;

                toc.push({
                    type: currentType,
                    title: currentTitle,
                    id: currentId
                });
            }
        }

        return toc;
    });

    return <div class="wiki">
        <div class="wiki--background">
            <img src="https://img3.gelbooru.com/images/bd/40/bd4052b6983ef3b3a3226bb7baea17cd.jpg" alt="" />
            <div class="wiki--background-overlay" />
        </div>
        <div class="wiki--header">
            <div class="wiki--header-title">
                <h1>Wiki</h1>
                <p>•</p>
                <p>Article</p>
            </div>
        </div>
        <div class="wiki--content">
            <div class="wiki--content-toc">
                <div class="wiki--content-toc-title">Table of Contents</div>
                <div class="wiki--content-toc-body">
                    <For each={toc()}>
                        {item => <div class="wiki--content-toc-body-item" data-type={item.type}>
                            <a href={`#${item.title}`}>{item.title}</a>
                        </div>}
                    </For>
                </div>
            </div>
            <div class="wiki--content-hinge" />
            <div class="wiki--content-body">
                <Markdown>
                    {article() === undefined ? "Loading..." : article()!.content}
                </Markdown>
            </div>
        </div>
    </div>;
}