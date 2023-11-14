import { ParentProps } from "solid-js";
import styles from "../../styles/components/textBox.module.scss";

export function TextBox(props: ParentProps<{
    placeholder?: string;
    value?: string;
    rows?: number;
    lightness?: string;
    ref?: HTMLTextAreaElement | undefined;
}>) {
    return <div class={styles.textbox} style={{ "--textbox-lightness": props.lightness ?? "var(--hsl-c4)" }}>
        <textarea name="text box" ref={props.ref} placeholder={props.placeholder} value={props.value ?? ""} rows={props.rows ?? 2} />
        <div class={styles.bottom}>
            {props.children}
        </div>
    </div>;
}