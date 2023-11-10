import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { Fa } from "solid-fa";
import { JSX } from "solid-js";

export interface ModalButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
    icon?: IconDefinition;
    text?: string;
    is: "primary" | "success" | "danger" | "warning";
}

export function ModalButton(props: ModalButtonProps) {
    return (
        <button class={`modal--body-button modal--body-button-${props.is}`} {...props}>
            {props.icon ? <Fa icon={props.icon} /> : undefined}
            {props.text}
        </button>
    );
}