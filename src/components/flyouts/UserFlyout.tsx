import anime from "animejs";
import { ParentProps, Show, createEffect, createSignal } from "solid-js";
import { Portal } from "solid-js/web";
import { useMouse } from "solidjs-use";
import { ApiAccount } from "../../structures/api/ApiAccount";
import "../../styles/components/flyouts/userFlyout.scss";

export function UserFlyout(props: ParentProps<{
    account?: ApiAccount
}>) {
    let interval: NodeJS.Timeout | undefined = undefined;

    const mouse = useMouse();
    const [shown, setShown] = createSignal(false);

    let flyout: HTMLDivElement | undefined = undefined;
    let portal: HTMLDivElement | undefined = undefined;
    let component: HTMLDivElement | undefined = undefined;

    createEffect(() => {
        portal?.style.setProperty("position", "absolute");
        portal?.style.setProperty("z-index", "10000");

        if (shown()) {
            anime({
                targets: portal,
                opacity: 1,
                duration: 200,
            });

            // move the portal to the right of the component if possible,
            // otherwise overflow it to the left.
            const componentRect = component?.getBoundingClientRect();
            const portalRect = portal?.getBoundingClientRect();

            if (componentRect && portalRect) {
                if (componentRect.right + portalRect.width + 16 > window.innerWidth) {
                    portal?.style.setProperty("left", `${(componentRect.left - 16) - portalRect.width}px`);
                    portal?.style.setProperty("top", `${componentRect.top}px`);
                } else {
                    portal?.style.setProperty("left", `${componentRect.right + 16}px`);
                    portal?.style.setProperty("top", `${componentRect.top}px`);
                }
            }
        } else {
            anime({
                targets: portal,
                opacity: 0,
                duration: 200,
            });
        }
    });

    return <div class="user_flyout--hoverable" onMouseEnter={() => {
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
            <Show when={shown()}>
                <a href={`/users/${props.account?.id}`} ref={flyout} class="user_flyout">
                    <div class="user_flyout--background">
                        <img src={`${import.meta.env.KUMI_API_URL}cdn/avatars/${props.account?.id}`} alt="" loading="lazy" onLoad={(v) => {
                            const img = v.target as HTMLImageElement;
                            img.style.opacity = "0";
                            anime({
                                targets: img,
                                opacity: [
                                    { value: 0, duration: 0 },
                                    { value: 1, duration: 500 },
                                ],
                            });
                        }} />
                        <div class="user_flyout--background-overlay" />
                    </div>
                    <div class="user_flyout--content">
                        <div class="user_flyout--content-avatar">
                            <img src={`${import.meta.env.KUMI_API_URL}cdn/avatars/${props.account?.id}`} alt="" loading="lazy" onLoad={(v) => {
                                const img = v.target as HTMLImageElement;
                                img.style.opacity = "0";
                                anime({
                                    targets: img,
                                    opacity: [
                                        { value: 0, duration: 0 },
                                        { value: 1, duration: 500 },
                                    ],
                                });
                            }} />
                        </div>
                        <div class="user_flyout--content-info">
                            <div class="user_flyout--content-info-username">{props.account?.username}</div>
                        </div>
                    </div>
                </a>
            </Show>
        </Portal>
    </div>;
}