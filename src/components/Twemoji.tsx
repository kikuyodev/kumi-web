import { ParentProps, createEffect, onMount } from "solid-js";
import twemoji from "twemoji";

export function Twemoji(props: ParentProps) {
    createEffect(() => {
        twemoji.parse(document.body);
    });

    onMount(() => {
        twemoji.parse(document.body);
    });
    
    return <>{props.children}</>;
}