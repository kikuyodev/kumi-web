import "./styles/index.scss";
import { Navigate, Route, Router, Routes } from "@solidjs/router";
import { render } from "solid-js/web";
import { lazily } from "solidjs-lazily";
import { Navbar } from "./components/Navbar";
import { AccountProvider, useAccount } from "./contexts/AccountContext";
import { ApiAccessProvider } from "./contexts/ApiAccessContext";
import { UserData } from "./data/UserData";
import { ChartModdingPage } from "./pages/ChartModdingPage";

const { Notfound } = lazily(() => import("./pages/404"));
const { Home } = lazily(() => import("./pages/HomePage"));
const { ChartPage } = lazily(() => import("./pages/ChartPage"));
const { UserPage } = lazily(() => import("./pages/UserPage"));

render(() => {
    if (sessionStorage.getItem("logged_in") === "true") {
        // check if the user is logged in.
        useAccount().me();
    }

    return (
        <AccountProvider>
            <ApiAccessProvider>
                <div id="app">
                    <Router>
                        <div class="wrapper--navbar">
                            <Navbar />
                        </div>
                        <div class="wrapper-app">
                            <Routes>
                                <Route path="/" element={<Navigate href="/home" />} />
                                <Route path="/home" component={Home} />
                                <Route path="/users/:id" component={UserPage} data={UserData} />
                                <Route path="/chartsets/:set" component={ChartPage} />
                                <Route path="/chartsets/:set/modding" component={ChartModdingPage} />
                                <Route path="/chartsets/:set/:chart" component={ChartPage} />
                                <Route path="*" component={Notfound} />
                            </Routes>
                        </div>
                    </Router>
                </div >
            </ApiAccessProvider>
        </AccountProvider>
    );
}, document.getElementById("webroot") as HTMLDivElement);