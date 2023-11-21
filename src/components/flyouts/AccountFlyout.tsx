import anime from "animejs";
import { ParentProps, Show, createEffect, createSignal } from "solid-js";
import { Portal } from "solid-js/web";
import { useMouse } from "solidjs-use";
import { ApiAccount } from "../../structures/api/ApiAccount";
import "../../styles/components/flyouts/accountFlyout.scss";
import { AccountCard } from "../accounts/AccountCard";

export function AccountFlyout(props: ParentProps<{
    account?: ApiAccount
}>) {
    let interval: NodeJS.Timeout | undefined = undefined;

    const mouse = useMouse();
    const [shown, setShown] = createSignal(false);
    const [visible, setVisible] = createSignal(false);

    let flyout: HTMLDivElement | undefined = undefined;
    let portal: HTMLDivElement | undefined = undefined;
    let component: HTMLDivElement | undefined = undefined;

    createEffect(() => {
        portal?.style.setProperty("position", "absolute");
        portal?.style.setProperty("z-index", "10000");

        if (shown()) {
            setVisible(true);
            anime({
                targets: portal,
                opacity: 1,
                duration: 200,
                easing: "easeOutExpo"
            });

            setTimeout(() => {
                // move the portal to the right of the component if possible,
                // otherwise overflow it to the left.
                const componentRect = component?.getBoundingClientRect();
                const portalRect = portal?.getBoundingClientRect();

                if (componentRect && portalRect) {
                    if (componentRect.right + portalRect.width + 16 > window.innerWidth) {
                        portal?.style.setProperty("left", `${(componentRect.left - 16) - portalRect.width}px`);
                        portal?.style.setProperty("top", `${componentRect.top + window.scrollY}px`);
                    } else {
                        portal?.style.setProperty("left", `${componentRect.right + 16}px`);
                        portal?.style.setProperty("top", `${componentRect.top + window.scrollY}px`);
                    }
                }
            }, 1);
        } else {
            anime({
                targets: portal,
                opacity: 0,
                duration: 200,
                easing: "easeOutExpo",
                complete: () => {
                    setVisible(false);
                }
            });
        }
    });

    return <div class="account_flyout--hoverable" onMouseEnter={() => {
        clearInterval(interval);
        setShown(true);
    }} onMouseLeave={() => {
        interval = setInterval(() => {
            if (flyout) {
                const flyoutRect = flyout.getBoundingClientRect();

                // check if mouse is inside the rect.
                if (mouse.x() > flyoutRect.left && mouse.x() < flyoutRect.right && mouse.y() > flyoutRect.top && mouse.y() < flyoutRect.bottom) {
                    return;
                }
            }

            setShown(false);
            clearInterval(interval);
        }, 200);
    }}>
        <div ref={component}>
            {props.children}
        </div>
        <Portal ref={portal} mount={document.body}>
            <Show when={visible()}>
                <div ref={flyout} class="account_flyout">
                    <AccountCard account={props.account} />
                </div>
            </Show>
        </Portal>
    </div>;
}