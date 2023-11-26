import { faArrowAltCircleDown } from "@fortawesome/free-regular-svg-icons";
import anime from "animejs";
import { Fa } from "solid-fa";
import "../styles/pages/home.scss";
import { useApi } from "../contexts/ApiAccessContext";
import { ApiNewsArticle } from "../structures/api/ApiNewsArticle";
import { For, createMemo } from "solid-js";

export function Home() {
    const stats = useApi(async api => await api.home.getStats());
    const news = useApi(async api => await api.getNews());

    return <div class="home">
        <div class="home--hero">
            <div class="home--hero-background">
                <div class="home--hero-background-image" style={{ "background-image": "url(\"https://pbs.twimg.com/media/F_esPzEaUAAzbeL?format=jpg&name=orig\")" }} />
                <div class="home--hero-background-overlay" />
            </div>
            <div class="home--hero-content">
                <img src="/assets/logo.png" alt="Kumi" />
                <div class="home--hero-content-description">A faithful recreation to Taiko no Tatsujin.</div>
                <button class="home--hero-content-download">
                    <Fa icon={faArrowAltCircleDown} />
                    <p>Download now!</p>
                </button>
                <div class="home--hero-content-info">
                    <strong>{stats()?.accounts.total}</strong> registered players, <strong>{stats()?.accounts.online}</strong> currently online
                    <br />
                    playing <strong>{stats()?.charts}</strong> charts with <strong>-1</strong> scores
                </div>
            </div>
        </div>
        <div class="home--content">
            <div class="home--content-news">
                <h1 class="home--content-news-header">News</h1>
                <div class="home--content-news-container">
                    <div class="home--content-news-track" />
                    <div class="home--content-news-list">
                        <For each={news()}>
                            {news => <NewsItem {...news} />}
                        </For>
                    </div>
                </div>
            </div>
            <div class="home--content-recent">
                <h1>Recently ranked charts</h1>
            </div>
        </div>
    </div>;
}

export function NewsItem(props: ApiNewsArticle) {
    const date = createMemo(() => {
        return new Date(Date.parse(props.posted_at));
    });

    const dateFormat = Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "short",
    });
    
    return <div class="home--content-news-list--item">
        <div class="home--content-news-list--item-track">
            <div class="home--content-news-list--item-track-circle">
                <div class="home--content-news-list--item-track-circle-inner" />
            </div>
            <div class="home--content-news-list--item-track-date">
                <span class="home--content-news-list--item-track-date-line" />
                <div class="home--content-news-list--item-track-date-content">
                    <h1>{date().getDate()}</h1>
                    <p>{dateFormat.format(date())}</p>
                </div>
            </div>
        </div>
        <a href={`/news/${props.slug}`} class="home--content-news-list--item-body">
            <div class="home--content-news-list--item-body-header">
                <div class="home--content-news-list--item-body-header-background">
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
                    <div class="home--content-news-list--item-body-header-background-overlay" />
                </div>
                <div class="home--content-news-list--item-body-header-content">
                    <h1>{props.title}</h1>
                    <p>Written by {props.author}</p>
                </div>
            </div>
            <div class="home--content-news-list--item-body-content">
                {props.headline}
            </div>
        </a>
    </div>;
}