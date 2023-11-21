import { ParentProps, createEffect } from "solid-js";

const parsers: { [key: string]: (text: string) => string } = {
    "b": (text) => `<strong>${text}</strong>`,
    "i": (text) => `<em>${text}</em>`,
    "u": (text) => `<u>${text}</u>`,
    "s": (text) => `<s>${text}</s>`,
    "url": (text) => `<a href="${text}">${text}</a>`,
    "img": (text) => `<img src="${text}" />`,
    "quote": (text) => `<blockquote>${text}</blockquote>`,
    "code": (text) => `<code>${text}</code>`,
    "color": (text) => `<span style="color: ${text}">${text}</span>`
};

export function BBCode(props: ParentProps & { children: string }) {
    let ref: HTMLDivElement | undefined = undefined;

    createEffect(() => {
        if (!ref) {
            return;
        }

        // bbcode parser
        const bbcode = ref.innerHTML;

        // replace all the bbcode with html
        let html = bbcode;

        
    })

    return <div ref={ref} class="_bbcode_">{props.children}</div>;
}