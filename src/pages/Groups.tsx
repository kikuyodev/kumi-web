import { For, Show } from "solid-js";
import { useApi } from "../contexts/ApiAccessContext";
import { ApiAccount, ApiGroup } from "../structures/api/ApiAccount";
import { AccountFlyout } from "../components/flyouts/AccountFlyout";
import { Util } from "../util/Util";
import "../styles/pages/groups.scss";

export function Groups() {
    const groups = useApi(async api => await api.account.getGroups());
    const members = useApi(async api => await api.account.getGroupMembers());

    return <div class="teams">
        <div class="teams--content">
            <div class="teams--content-header">
                <h1>Groups</h1>
                <p>•</p>
                <p>Listing</p>
            </div>
            <div class="teams--content-body">
                <For each={groups()}>
                    {group => <Group group={group} members={members()?.groups.find(g => g.id === group.id)?.members} />}
                </For>
            </div>
        </div>
    </div>;
}

export function Group(props: {
    group: ApiGroup;
    members?: ApiAccount[]
}) {
    return <div class="teams--content-body--team">
        <a href={`/groups/${props.group.id}`} class="teams--content-body--team-details">
            <div class="teams--content-body--team-details-header">
                <span class="teams--content-body--team-details-header-light" style={{ "background-color": props.group.color }} />
                <h1>{props.group.name}</h1>
            </div>
            <div class="teams--content-body--team-details-description">
                <p>A short but descriptive description detailing what this group is all about, detailing what the members of this group does and the sorts</p>
            </div>
        </a>
        <div class="teams--content-body--team-members">
            <For each={props.members ?? []}>
                {member => <GroupMember {...member} />}
            </For>
        </div>
    </div>;
}

export function GroupMember(props: ApiAccount) {
    return <AccountFlyout account={props}>
        <a href={`/accounts/${props.id}`} class="teams--content-body--team-members--member">
            <img src={Util.getCdnFor("avatars", props.id)} alt="avatar" />
            <div class="teams--content-body--team-members--member-info">
                <h1>{props.username}</h1>
                <Show when={props.title}>
                    <p style={{ "color": props.primary!.color }}>{props.title}</p>
                </Show>
            </div>
        </a>
    </AccountFlyout>;
}