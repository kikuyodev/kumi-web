import { useNavigate, useParams } from "@solidjs/router";
import { For, createEffect, createSignal } from "solid-js";
import { AccountCard } from "../components/accounts/AccountCard";
import { GroupTag } from "../components/accounts/GroupTag";
import { SegmentedControl } from "../components/controls/SegmentedControl";
import { Markdown } from "../components/Markdown";
import { useApi } from "../contexts/ApiAccessContext";
import "../styles/pages/group.scss";
import { ApiAccount } from "../structures/api/ApiAccount";
import { Exception } from "../util/errors/Exception";

export function Group() {
    const navigate = useNavigate();
    const params = useParams();
    const group = useApi(async (access) => access.getGroup(params.id));

    const [users, setUsers] = createSignal<ApiAccount[]>([]);
    const [status, setStatus] = createSignal<"online" | "offline" | "all">("online");

    createEffect(() => {
        if (group() === undefined) {
            return;
        }

        if (group()?.group?.description == undefined) {
            throw new Exception("The group you are looking for does not exist.", 404);
        }

        const members = group()?.members.filter((user) => status() === "all" || user.status === status()).sort((a, b) => a.username.localeCompare(b.username));

        setUsers(members ?? []);
        console.log(members);
    });

    return <div class="group">
        <div class="group--background">
            <div class="group--background-color" style={{ "background-color": group()?.group?.color }} />
            <div class="group--background-overlay" />
        </div>
        <div class="group--content">
            <div class="group--content-title">
                Group <span>{group()?.group?.tag}</span>
            </div>
            <div class="group--content-details">
                <div class="group--content-details-top">
                    <style>{`.group--content-details-header::before { background-color: ${group()?.group?.color} }`}</style>
                    <div class="group--content-details-header">
                        <div class="group--content-details-header-body">
                            <div class="group--content-details-header-body-title">
                                {group()?.group?.name}
                            </div>
                            <div class="group--content-details-header-body-info">
                                <GroupTag group={group()?.group} />
                                <p>•</p>
                                <p>3 members, 0 online</p>
                            </div>
                        </div>
                    </div>
                    <div class="group--content-details-body">
                        <p class="group--content-details-body-description">
                            <Markdown>{group()?.group?.description}</Markdown>
                        </p>
                        <SegmentedControl options={["Online", "Offline", "All"]} selected="Online" onChange={(v) => {
                            switch (v) {
                                case "Online":
                                    setStatus("online");
                                    break;
                                case "Offline":
                                    setStatus("offline");
                                    break;
                                case "All":
                                    setStatus("all");
                                    break;
                            }
                        }} />
                    </div>
                </div>
                <div class="group--content-details-bottom">
                    <For each={users()}>
                        {(user) => <AccountCard account={user} />}
                    </For>
                </div>
            </div>
        </div>
    </div>;
}