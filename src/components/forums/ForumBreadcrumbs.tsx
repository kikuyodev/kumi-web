import { For, Show } from "solid-js";
import styles from "../../styles/components/forums/breadcrumbs.module.scss";

export function ForumsBreadcrumbs(props: {
    crumbs: {
        name: string;
        href: string;
    }[];
}) {
    return <div class={styles.content}>
        <a href="/forums">Index</a>
        <For each={props.crumbs}>
            {(crumb, i) => {
                return <>
                    <p>»</p>
                    <Show when={i() === props.crumbs.length - 1}>
                        <h1>{crumb.name}</h1>
                    </Show>
                    <Show when={i() !== props.crumbs.length - 1}>
                        <a href={crumb.href}>{crumb.name}</a>
                    </Show>
                </>;
            }}
        </For>
    </div>;
}