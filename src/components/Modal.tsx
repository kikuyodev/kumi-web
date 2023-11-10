import { JSX, ParentProps, Show } from "solid-js";
import { ModalButtons } from "./modals/ModalButtons";
import { Portal } from "solid-js/web";

export interface ModalProps {
    title: string;
    visible: boolean;
    buttons?: JSX.Element[];

    close: () => void;
}

export function Modal(props: ParentProps<ModalProps>) {
    let backgroundRef: HTMLDivElement | undefined = undefined;

    function onBackgroundClick(e: MouseEvent) {
        e.preventDefault();

        if (e.target === backgroundRef) {
            props.close();
        }
    }

    return (
        <Portal mount={document.body}>
            <Show when={props.visible}>
                <div
                    class="modal--background"
                    style={{ display: props.visible ? "flex" : "none" }}
                    onClick={onBackgroundClick}
                    ref={backgroundRef}
                >
                    <div class="modal">
                        <div class="modal--body">
                            <div class="modal--body-title">{props.title}</div>
                            <div class="modal--body-content">
                                {props.children}
                            </div>
                            {props.buttons ? <ModalButtons>{props.buttons}</ModalButtons> : undefined}
                        </div>
                    </div>
                </div>
            </Show>
        </Portal>
    );
}