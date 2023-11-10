import { ParentProps } from "solid-js";

export function ModalButtons(props: ParentProps) {
    return (
        <div class="modal--body-buttons">
            {props.children}
        </div>
    );
}