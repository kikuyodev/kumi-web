import { ApiGroup } from "../../structures/api/ApiAccount";
import styles from "../../styles/components/accounts/groupBadge.module.scss";
import { Tooltip } from "../Tooltip";

export interface GroupBadgeProps {
    group: ApiGroup;
}

export function GroupBadge(props: GroupBadgeProps) {
    return (
        <Tooltip text={props.group.name}>
            <div class={styles.badge} style={{ color: props.group.color }}>
                {props.group.tag}
            </div>
        </Tooltip>
    );
}