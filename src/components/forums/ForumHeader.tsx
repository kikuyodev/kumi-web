import styles from "../../styles/components/forums/header.module.scss";

export function ForumHeader(props: {
    name: string;
    description: string;
    color: string;
    fadedDescription?: boolean;
}) {
    return <div class={styles.content}>
        <div class={styles.name}>
            <h1>{props.name}</h1>
            <span style={{ "background-color": props.color }} />
        </div>
        <div class={styles.description}>
            <p style={{
                color: props.fadedDescription ? "hsl(var(--base-hue), 15%, 40%)" : "var(--hsl-l2)"
            }}>{props.description}</p>
        </div>
    </div>;
}