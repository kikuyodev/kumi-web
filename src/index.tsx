import "./styles/index.scss";
import { Navigate, Route, Router, Routes } from "@solidjs/router";
import { render } from "solid-js/web";
import { lazily } from "solidjs-lazily";
import { Navbar } from "./components/Navbar";
import { UserRouteData } from "./data/UserRouteData";
import { Account } from "./structures/Account";

const { Notfound } = lazily(() => import("./pages/404"));
const { Home } = lazily(() => import("./pages/home"));

render(() => {
    fetchAccountInstance();
    
    return <div id="app">
        <Router>
            <div class="wrapper--navbar">
                <Navbar />
            </div>
            <div class="wrapper-app">
                <Routes>
                    <Route path="/" element={<Navigate href="/home" />} />
                    <Route path="/home" component={Home} />
                    <Route path="*" component={Notfound} />
                    {UserRouteData}
                </Routes>
            </div>
        </Router>
    </div>;
}, document.getElementById("webroot") as HTMLDivElement);

function fetchAccountInstance() {
    // TODO: authenticate from cookie
    const data = sessionStorage.getItem("_KUMI_ACCOUNT_");
    const instance = new Account(data ? JSON.parse(data) : undefined);
    
    Account.instance = instance;
    return instance;
}