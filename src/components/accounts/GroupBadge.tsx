import { ApiGroup } from "../../structures/api/ApiAccount";
import styles from "../../styles/components/groupBadge.module.scss";

export interface GroupBadgeProps {
    group: ApiGroup;
}

export function GroupBadge(props: GroupBadgeProps) {
    return <div class={styles.badge} style={{ color: props.group.color }}>{props.group.tag}</div>;
}