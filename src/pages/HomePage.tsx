import { faArrowAltCircleDown } from "@fortawesome/free-regular-svg-icons";
import anime from "animejs";
import { Fa } from "solid-fa";
import "../styles/pages/home.scss";

export function Home() {
    return <div class="home">
        <div class="home--hero">
            <div class="home--hero-background">
                <img src="https://pbs.twimg.com/media/F_esPzEaUAAzbeL?format=jpg&name=orig" alt="" style={{ opacity: 0 }} onLoad={(v) => {
                    anime({
                        targets: v.target,
                        opacity: [
                            { value: 0, duration: 0 },
                            { value: 1, duration: 1000 }
                        ],
                        easing: "linear"
                    });
                }} />
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
                    <strong>1</strong> registered players, <strong>none</strong> currently online
                    <br />
                    playing <strong>0</strong> charts with <strong>-1</strong> scores
                </div>
            </div>
        </div>
        <div class="home--content">
            <div class="home--content-news">
                <h1 class="home--content-news-header">News</h1>
                <div class="home--content-news-container">
                    <div class="home--content-news-track" />
                    <div class="home--content-news-list">
                        <div class="home--content-news-list--item">
                            <div class="home--content-news-list--item-track">
                                <div class="home--content-news-list--item-track-circle">
                                    <div class="home--content-news-list--item-track-circle-inner" />
                                </div>
                                <div class="home--content-news-list--item-track-date">
                                    <span class="home--content-news-list--item-track-date-line" />
                                    <div class="home--content-news-list--item-track-date-content">
                                        <h1>22</h1>
                                        <p>Nov 2023</p>
                                    </div>
                                </div>
                            </div>
                            <div class="home--content-news-list--item-body">
                                <div class="home--content-news-list--item-body-header">
                                    <div class="home--content-news-list--item-body-header-background">
                                        <img src="https://pbs.twimg.com/media/F_esPzEaUAAzbeL?format=jpg&name=orig" alt="" style={{ opacity: 0 }} onLoad={(v) => {
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
                                        <h1>News title</h1>
                                        <p>written by <a href="#">Saryu</a></p>
                                    </div>
                                </div>
                                <div class="home--content-news-list--item-body-content">
                                    Lorem ipsum dolor sit amet consectetur. Massa sociis cras tincidunt viverra orci tempor ut tristique. Bibendum aliquam pharetra condimentum eget massa tincidunt non quis sed. Rhoncus a lorem lectus in. Velit tellus sollicitudin consequat amet aliquet egestas odio felis diam. Volutpat.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="home--content-recent">
                <h1>Recently ranked charts</h1>
            </div>
        </div>
    </div>;
}