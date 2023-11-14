import { For, Resource, createEffect, createSignal } from "solid-js";
import { ApiChartSet } from "../../../structures/api/ApiChartSet";
import { ApiAccount } from "../../../structures/api/ApiAccount";

export interface ChartNominationSectionProps {
    set: Resource<ApiChartSet | undefined>,
}

type Nominator = ApiAccount | undefined;

export function ChartNominationSection(props: ChartNominationSectionProps) {
    const [nominators, setNominators] = createSignal<Nominator[] | undefined>();
    
    createEffect(() => {
        if (!props.set()) {
            return;
        }
        const nominations: Nominator[] = new Array(props.set()?.attributes.nominators_required);

        // force a re-render.
        for (const idx in props.set()?.nominators ?? []) {
            nominations[idx] = props.set()?.nominators[idx];
        }

        setNominators(nominations);
    }, [props.set()?.nominators]);

    return (
        <For each={nominators()}>
            {v => <Nominator account={v} />}
        </For>
    );
}

export function Nominator(props: {
    account: ApiAccount | undefined
}) {
    return (
        <div class="chart_modding--nominations--nominator">
            <div class="chart_modding--nominations--nominator-avatar" data-nominator={props.account?.id ?? "none"}>
                {props.account &&
                    <img src={`${import.meta.env.KUMI_API_URL}cdn/avatars/${props.account?.id ?? "default"}`} alt="" loading="lazy" />}
            </div>
            <div class="chart_modding--nominations--nominator-username" data-nominator={props.account?.id ?? "none"}>
                {props.account?.username ?? "Nobody"}
            </div>
        </div>
    );
}