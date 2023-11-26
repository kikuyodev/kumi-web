import { useParams } from "@solidjs/router";
import { useApi } from "../../contexts/ApiAccessContext";
import anime from "animejs";
import { createMemo } from "solid-js";
import { Markdown } from "../../components/markup/Markdown";
import "../../styles/pages/news/article.scss";

export function Article() {
    const params = useParams();
    const article = useApi(async api => await api.getNewsArticle(params.slug));

    const date = createMemo(() => {
        if (article() === undefined) {
            return new Date();
        }

        return new Date(article()!.posted_at);
    });

    const formatter = Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    return <div class="news_article">
        <div class="news_article--content">
            <div class="news_article--content-header">
                <h1>News</h1>
                <p>•</p>
                <p>Article</p>
            </div>
            <div class="news_article--content-body">
                <div class="news_article--content-body-selector">
                    <button class="news_article--content-body-selector-selected">2023</button>
                    <button>2022</button>
                    <button>2021</button>
                    <button>2020</button>
                </div>
                <div class="news_article--content-body-content">
                    <div class="news_article--content-body-content-breadcrumbs">
                        <a href="/news">Index</a>
                        <p>»</p>
                        <p>{article()?.title}</p>
                    </div>
                    <div class="news_article--content-body-content-header">
                        <div class="news_article--content-body-content-header-image">
                            <img src={article()?.banner} alt="" style={{ opacity: 0 }} onLoad={() => {
                                anime({
                                    targets: ".news_article--content-body-content-header-image img",
                                    opacity: [
                                        { value: 0, duration: 0 },
                                        { value: 1, duration: 500 }
                                    ]
                                });
                            }} />
                            <div class="news_article--content-body-content-header-image-overlay" />
                        </div>
                        <div class="news_article--content-body-content-header-content">
                            <div class="news_article--content-body-content-header-content-left">
                                <p>{formatter.format(date())}</p>
                                <h1>{article()?.title}</h1>
                            </div>
                            <div class="news_article--content-body-content-header-content-right">
                                <div class="news_article--content-body-content-header-content-right-name">
                                    <p>Written by</p>
                                    <h1>{article()?.author}</h1>
                                </div>
                                {/* <div class="news_article--content-body-content-header-content-right-avatar">
                                    <img src={article()?.banner} alt="" />
                                </div> */}
                            </div>
                        </div>
                    </div>
                    <div class="news_article--content-body-content-body">
                        <Markdown>
                            {article()?.content}
                        </Markdown>
                    </div>
                </div>
            </div>
        </div>
    </div>;
}