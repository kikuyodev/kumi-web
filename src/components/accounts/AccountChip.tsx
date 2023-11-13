import { Show } from "solid-js";
import { ApiAccount } from "../../structures/api/ApiAccount";
import styles from "../../styles/components/accounts/accountChip.module.scss";

export function AccountChip(props: {
    account: ApiAccount,
    description?: string,
    onClick?: () => void
}) {
    return <div class={styles.chip} onClick={() => props.onClick?.()}>
        <div class={styles.avatar} style={{
            "box-shadow": props.account.primary !== undefined ? `0 0 2px 1.5px ${props.account.primary.color}` : "none"
        }}>
            <img src={`${import.meta.env.KUMI_API_URL}cdn/avatars/${props.account.id}`} alt="" loading="lazy" />
        </div>
        <div class={styles.info}>
            <h1 class={styles.username}>{props.account.username}</h1>
            <Show when={props.description}>
                <p class={styles.description}>{props.description}</p>
            </Show>
        </div>
    </div>;
}