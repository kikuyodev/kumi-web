export interface ChartBodyTabProps {
    href: string;
    text: string;
    selected?: boolean;
}

export function ChartBodyTab(props: ChartBodyTabProps) {
    return (
        <a href={props.href} class={`chart--content-details--body-tab${props.selected ? " chart--content-details--body-tab-selected" : ""}`}>{props.text}</a>
    );
}