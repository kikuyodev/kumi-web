import { For, createEffect, createSignal } from "solid-js";
import styles from "../../styles/components/controls/segmentedControl.module.scss";

export function SegmentedControl<T extends string>(props: {
    options: T[];
    selected: T;
    onChange?: (value: T) => void;
}) {
    let [selected, setSelected] = createSignal(props.selected as unknown);
    let background: HTMLDivElement | undefined;
    let control: HTMLDivElement | undefined;

    createEffect(() => {
        if (!background) {
            return;
        }

        let index = props.options.indexOf(selected() as T);
        let element = control?.children[index] as HTMLDivElement;
        background.style.width = `${element.clientWidth}px`;
        background.style.left = `${element.offsetLeft}px`;
    });
    
    return (
        <div ref={control} class={styles.control}>
            <For each={props.options}>
                {option => (
                    <SegmentedControlOption
                        value={option}
                        selected={selected() === option}
                        onClick={v => {
                            setSelected(v as unknown);
                            props.onChange?.(v);
                        }}
                    />
                )}
            </For>
            <div ref={background} class={styles.highlight} />
        </div>
    );
}

export function SegmentedControlOption<T extends string>(props: {
    value: T;
    selected: boolean;
    onClick?: (value: T) => void;
}) {
    return (
        <div
            class={props.selected ? styles.selected : styles.unselected}
            onClick={() => props.onClick?.(props.value)}
        >
            {props.value}
        </div>
    );
}