import { ApiGroup } from "../../structures/api/ApiAccount";
import styles from "../../styles/components/accounts/groupTag.module.scss";
import { Tooltip } from "../Tooltip";

export interface GroupTagProps {
    group: ApiGroup;
}

export function GroupTag(props: GroupTagProps) {
    return (
        <Tooltip text={props.group.name}>
            <div class={styles.tag} style={{ color: props.group.color }}>
                {props.group.tag}
            </div>
        </Tooltip>
    );
}