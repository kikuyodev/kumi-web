import { ParentProps } from "solid-js";
import styles from "../styles/components/textBox.module.scss";

export function TextBox(props: ParentProps<{
    placeholder?: string;
    rows?: number;
}>) {
    let textArea: HTMLTextAreaElement | undefined = undefined;
    
    return <div class={styles.textbox}>
        <textarea name="text box" ref={textArea} placeholder={props.placeholder} rows={props.rows ?? 2} />
        <div class={styles.bottom}>
            {props.children}
        </div>
    </div>;
}