import { A } from "@solidjs/router";
import { Show, createEffect, createSignal, onMount } from "solid-js";
import { Portal } from "solid-js/web";
import { LoginFlyout } from "./flyouts/LoginFlyout";
import "../styles/components/navbar.scss";
import { useAccount } from "../contexts/AccountContext";
import { AccountNavbarFlyout } from "./flyouts/AccountNavbarFlyout";

let FLYOUT_OPEN = false;

export function Navbar() {
    const account = useAccount();

    let flyoutMenu: HTMLDivElement | undefined = undefined;
    let avatar: HTMLImageElement | undefined = undefined;

    let [showFlyout, setShowFlyout] = createSignal(false);

    createEffect(() => {
        if (showFlyout()) {
            const avatarRect = avatar?.getBoundingClientRect();
            flyoutMenu?.style.setProperty("display", "block");

            const flyoutRect = flyoutMenu!.children[0]!.getBoundingClientRect();

            flyoutMenu?.style.setProperty("position", "absolute");
            flyoutMenu?.style.setProperty("top", `${(avatarRect?.bottom ?? 0) + 4}px`);
            flyoutMenu?.style.setProperty("left", `${Math.abs(((avatarRect?.left ?? 0) + (avatarRect?.width ?? 0)) - (flyoutRect?.width ?? 0))}px`);
            flyoutMenu?.style.setProperty("z-index", "10000");

            window.addEventListener("resize", () => {
                const avatarRect = avatar?.getBoundingClientRect();
                const flyoutRect = flyoutMenu!.children[0]!.getBoundingClientRect();

                flyoutMenu?.style.setProperty("position", "absolute");
                flyoutMenu?.style.setProperty("top", `${(avatarRect?.bottom ?? 0) + 4}px`);
                flyoutMenu?.style.setProperty("left", `${Math.abs(((avatarRect?.left ?? 0) + (avatarRect?.width ?? 0)) - (flyoutRect?.width ?? 0))}px`);
            });
        } else {
            flyoutMenu?.style.setProperty("display", "none");
        }
    });

    onMount(() => {
        flyoutMenu?.style.setProperty("display", "none");

        document.addEventListener("click", (e) => {
            if (e.target !== avatar && FLYOUT_OPEN) {
                if (flyoutMenu?.contains(e.target as Node)) {
                    return;
                }

                FLYOUT_OPEN = false;
                flyoutMenu?.style.setProperty("display", "none");
            }
        });
    });

    return (
        <div class="navbar">
            <div class="navbar--content">
                <a href="/" class="navbar--content-logo">
                    <img src="/assets/logo.png" alt="Kumi" />
                </a>
                <div class="navbar--content-flex">
                    <div class="navbar--content-flex-links">
                        <A href="/home" activeClass="navbar--content-flex-links-active">Home</A>
                        <A href="/chartsets" activeClass="navbar--content-flex-links-active">Charts</A>
                        <A href="/rankings" activeClass="navbar--content-flex-links-active">Rankings</A>
                        <A href="/forums" activeClass="navbar--content-flex-links-active">Community</A>
                        <A href="/help" activeClass="navbar--content-flex-links-active">Wiki</A>
                    </div>
                    <div class="navbar--content-flex-account">
                        <div class="navbar--content-flex-account-details">
                            <Show when={account.isLoggedIn()}>
                                <div class="navbar--content-flex-account-details-username">{account.apiAccount?.username ?? "Saryu"}</div>
                            </Show>
                        </div>
                        <div class="navbar--content-flex-account-avatar">
                            <Show when={account.isLoggedIn()}>
                                <img ref={avatar} src={`${import.meta.env.KUMI_API_URL}cdn/avatars/${account.apiAccount!.id}`} alt="" onClick={() => setShowFlyout(!showFlyout())} />
                                <Portal ref={flyoutMenu} mount={document.body}>
                                    <Show when={showFlyout()}>
                                        <AccountNavbarFlyout />
                                    </Show>
                                </Portal>
                            </Show>
                            <Show when={!account.isLoggedIn()}>
                                <img ref={avatar} src={`${import.meta.env.KUMI_API_URL}cdn/avatars/default`} alt="" onClick={() => setShowFlyout(!showFlyout())} />
                                <Portal ref={flyoutMenu} mount={document.body}>
                                    <LoginFlyout />
                                </Portal>
                            </Show>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}