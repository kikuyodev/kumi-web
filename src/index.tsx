import "./styles/index.scss";
import { Navigate, Route, Router, Routes } from "@solidjs/router";
import { ErrorBoundary, render } from "solid-js/web";
import { lazily } from "solidjs-lazily";
import { Navbar } from "./components/Navbar";
import { AccountProvider, useAccount } from "./contexts/AccountContext";
import { ApiAccessProvider } from "./contexts/ApiAccessContext";
import { IntlProviderWrapperContext } from "./contexts/IntlProviderWrapperContext";
import { AccountData } from "./data/AccountData";
import { Twemoji } from "./components/Twemoji";
import { Exception } from "./util/errors/Exception";
import { ErrorPage } from "./pages/ErrorPage";
import { ApiResponseError } from "./util/errors/ApiResponseError";
import { GlobalAudioProvider } from "./contexts/AudioContext";

// Single pages
const { Home } = lazily(() => import("./pages/HomePage"));
const { Group } = lazily(() => import("./pages/Group"));
const { AccountPage } = lazily(() => import("./pages/AccountPage"));
const { Wiki } = lazily(() => import("./pages/Wiki"));
const { Rankings } = lazily(() => import("./pages/Rankings"));

// Charts
const { ChartListing } = lazily(() => import("./pages/ChartListing"));
const { ChartPage } = lazily(() => import("./pages/ChartPage"));
const { ChartModdingPage } = lazily(() => import("./pages/ChartModdingPage"));

// Forums
const { Forums } = lazily(() => import("./pages/Forums"));
const { Forum } = lazily(() => import("./pages/forums/Forum"));
const { Thread } = lazily(() => import("./pages/forums/Thread"));

// News
const { News } = lazily(() => import("./pages/News"));
const { Article } = lazily(() => import("./pages/news/Article"));

render(() => {
    if (sessionStorage.getItem("logged_in") === "true") {
        // check if the account is logged in.
        useAccount().me();
    }

    return (
        <GlobalAudioProvider>
            <IntlProviderWrapperContext>
                <AccountProvider>
                    <ApiAccessProvider>
                        <Twemoji>
                            <div id="app">
                                <Router>
                                    <div class="wrapper--navbar">
                                        <Navbar />
                                    </div>
                                    <div class="wrapper-app">
                                        <ErrorBoundary fallback={err => {
                                            console.error(err);
                                            
                                            if (err instanceof Exception) {
                                                console.log(err.stack);
                                                return <ErrorPage {...err} />;
                                            } else if (err instanceof ApiResponseError) {
                                                return <ErrorPage {...err} />;
                                            } else {
                                                return <ErrorPage code={500} message="An unknown error occurred." />;
                                            }
                                        }}>
                                            <Routes>
                                                <Route path="/" element={<Navigate href="/home" />} />
                                                <Route path="/home" component={Home} />
                                                <Route path="/rankings" component={Rankings} />
                                                <Route path="/groups/:id" component={Group} />
                                                <Route path="/forums">
                                                    <Route path="/" component={Forums} />
                                                    <Route path="/:id" component={Forum} />
                                                    <Route path="/threads/:id" component={Thread} />
                                                    <Route path="*" element={<ErrorPage code={404} message={"The forum, thread, or topic you were looking for does not exist."} />} />
                                                </Route>
                                                <Route path="/news">
                                                    <Route path="/" component={News} />
                                                    <Route path="/:slug" component={Article} />
                                                    <Route path="*" element={<ErrorPage code={404} message={"The article you were looking for does not exist."} />} />
                                                </Route>
                                                <Route path="/wiki/:language/*page" component={Wiki} />
                                                <Route path="/accounts/:id" component={AccountPage} data={AccountData} />
                                                <Route path="/chartsets" component={ChartListing} />
                                                <Route path="/chartsets/:set" component={ChartPage} />
                                                <Route path="/chartsets/:set/modding" component={ChartModdingPage} />
                                                <Route path="/chartsets/:set/:chart" component={ChartPage} />
                                                <Route path="*" element={<ErrorPage code={404} message={"nya"} />} />
                                            </Routes>
                                        </ErrorBoundary>
                                    </div>
                                </Router>
                            </div >
                        </Twemoji>
                    </ApiAccessProvider>
                </AccountProvider>
            </IntlProviderWrapperContext>
        </GlobalAudioProvider>
    );
}, document.getElementById("webroot") as HTMLDivElement);
