import anime from "animejs";
import { ApiNewsArticle } from "../structures/api/ApiNewsArticle";
import "../styles/pages/news.scss";
import { For, createMemo } from "solid-js";
import { useApi } from "../contexts/ApiAccessContext";

export function News() {
    const news = useApi(async api => await api.getNews());
    
    return <div class="news">
        <div class="news--content">
            <div class="news--content-header">
                <h1>News</h1>
                <p>•</p>
                <p>Articles</p>
            </div>
            <div class="news--content-body">
                <div class="news--content-body-selector">
                    <button class="news--content-body-selector-selected">2023</button>
                    <button>2022</button>
                    <button>2021</button>
                    <button>2020</button>
                </div>
                <div class="news--content-body-list">
                    <div class="news--content-body-list-selector">
                        <button class="news--content-body-list-selector-selected">November</button>
                        <button>October</button>
                        <button>September</button>
                        <button>August</button>
                        <button>July</button>
                        <button>June</button>
                        <button>May</button>
                        <button>April</button>
                        <button>March</button>
                        <button>February</button>
                        <button>January</button>
                    </div>
                    <For each={news()}>
                        {article => <Article {...article} />}
                    </For>
                </div>
            </div>
        </div>
    </div>;
}

export function Article(props: ApiNewsArticle) {
    let formattedDate = createMemo(() => {
        return new Date(props.posted_at);
    });

    let formatter = Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
    
    return <a href={`/news/${props.slug}`} class="news--content-body-list--article">
        <div class="news--content-body-list--article-header">
            <div class="news--content-body-list--article-header-background">
                <img src={props.banner} alt="" style={{ opacity: 0 }} onLoad={(v) => {
                    anime({
                        targets: v.target,
                        opacity: [
                            { value: 0, duration: 0 },
                            { value: 1, duration: 1000 }
                        ],
                        easing: "linear"
                    });
                }} />
                <div class="news--content-body-list--article-header-background-overlay" />
            </div>
            <div class="news--content-body-list--article-header-content">
                <div class="news--content-body-list--article-header-content-left">
                    <h1>{props.title}</h1>
                    <p>Written by {props.author}</p>
                </div>
                <div class="news--content-body-list--article-header-content-right">
                    <p>{formatter.format(formattedDate())}</p>
                </div>
            </div>
        </div>
        <div class="news--content-body-list--article-content">
            {props.headline}
        </div>
    </a>;
}