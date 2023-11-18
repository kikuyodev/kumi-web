import { useParams } from "@solidjs/router";
import { GroupTag } from "../components/accounts/GroupTag";
import { SegmentedControl } from "../components/controls/SegmentedControl";
import { useApi } from "../contexts/ApiAccessContext";
import { createSignal } from "solid-js";
import { ApiGroup } from "../structures/api/ApiAccount";
import "../styles/pages/group.scss";

export function Group() {
    const params = useParams();
    // const group = useApi(async (access) => access.getGroup(params.group));
    const [group] = createSignal<ApiGroup | undefined>({ id: 1, color: "#F56231", created_at: new Date(), identifier: "NAT", name: "Nomination Assessment Team", tag: "NAT", permissions: 0, priority: 0, updated_at: new Date(), visible: true });

    return <div class="group">
        <div class="group--background">
            <div class="group--background-color" style={{ "background-color": group()?.color }} />
            <div class="group--background-overlay" />
        </div>
        <div class="group--content">
            <div class="group--content-title">
                Group <span>{group()?.tag}</span>
            </div>
            <div class="group--content-details">
                <div class="group--content-details-top">
                    <style>{`.group--content-details-header::before { background-color: ${group()?.color} }`}</style>
                    <div class="group--content-details-header">
                        <div class="group--content-details-header-body">
                            <div class="group--content-details-header-body-title">
                                {group()?.name}
                            </div>
                            <div class="group--content-details-header-body-info">
                                <GroupTag group={group()!} />
                                <p>•</p>
                                <p>3 members, 0 online</p>
                            </div>
                        </div>
                    </div>
                    <div class="group--content-details-body">
                        <p class="group--content-details-body-description">
                            The <strong>Nomination Assessment Team</strong> (NAT) is a group of people responsible for assessing the quality and condition of members of the game's core process behind pushing maps for ranked, the <strong><a href="/">Chart Nominators</a></strong>. Including the leadership over ensuring that the mapping process is running effectively, they are freely tasked with formalizing any and all documentation and <a href="/">procedures regarding the means at which charts can be nominated</a>, such as the <a href="/">criterion for eligibility</a>, and the <a href="/">overall oversight of nomination at a whole.</a><br /><br />

                            This group consists of members of the community who've procured prolific evidence that they are active and proficient mentors of the community, and thus they are entrusted with a role that grants them the ability to represent the community they've helped build.<br /><br />

                            They share a priority and set of permissions with their sister group, the <strong><a href="/">Community Moderation Team</a></strong>, and have the same permissions; however, they have the additional but optional privilege of nominating charts, until deemed necessary to ensure the very quality of the team itself.
                        </p>
                        <SegmentedControl options={["Online", "Offline", "All"]} selected="Online" />
                    </div>
                </div>
                <div class="group--content-details-bottom">
                    {/* todo */}
                    <p>wan</p>
                </div>
            </div>
        </div>
    </div>;
}