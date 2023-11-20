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

const { Notfound } = lazily(() => import("./pages/404"));
const { Home } = lazily(() => import("./pages/HomePage"));
const { Group } = lazily(() => import("./pages/Group"));
const { ChartListing } = lazily(() => import("./pages/ChartListing"));
const { ChartPage } = lazily(() => import("./pages/ChartPage"));
const { AccountPage } = lazily(() => import("./pages/AccountPage"));
const { ChartModdingPage } = lazily(() => import("./pages/ChartModdingPage"));

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
                                                return <ErrorPage {...err} />;
                                            } else if (err instanceof ApiResponseError) {
                                                return <ErrorPage code={err.code} message={err.message} />;
                                            } else {
                                                return <ErrorPage code={500} message="An unknown error occurred." />;
                                            }
                                        }}>
                                            <Routes>
                                                <Route path="/" element={<Navigate href="/home" />} />
                                                <Route path="/home" component={Home} />
                                                <Route path="/groups/:id" component={Group} />
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
