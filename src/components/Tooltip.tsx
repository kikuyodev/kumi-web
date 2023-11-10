import { ParentProps, createSignal } from "solid-js";
import "../styles/components/tooltip.scss";

export interface TooltipProps {
    text: string;
}

export function Tooltip(props: ParentProps<TooltipProps>) {
    const [visible, setVisible] = createSignal(false);

    return (
        <div
            class="tooltip"
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            {props.children}
            {visible() && <div class="tooltip--content">{props.text}</div>}
        </div>
    );
}