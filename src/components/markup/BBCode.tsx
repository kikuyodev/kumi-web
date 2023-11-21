import { TagNode } from "@bbob/plugin-helper";
import { createPreset } from "@bbob/preset";
import { ParentProps, createEffect } from "solid-js";
import bbobHTML from "@bbob/html";

export function BBCode(props: ParentProps & { children: string }) {
    let ref: HTMLDivElement | undefined = undefined;

    createEffect(() => {
        if (!ref) {
            return;
        }

        // // bbcode parser
        const bbcode = ref.innerText;
        const processed = bbobHTML(bbcode, BBCodePreset());
        ref.innerHTML = processed;
    });

    return <div ref={ref} class="_markdown_">{props.children}</div>;
}

export const BBCodePreset = createPreset({
    b: (node) => new TagNode("strong", node.attrs, node.content ?? ""),
    i: (node) => new TagNode("em", node.attrs, node.content ?? ""),
    u: (node) => new TagNode("u", node.attrs, node.content ?? ""),
    s: (node) => new TagNode("s", node.attrs, node.content ?? ""),
    url: (node) => new TagNode("a", { href: getFirstAttribute(node) }, node.content ?? ""),
    img: (node) => new TagNode("img", { src: node.content![0] as string }, ""),
    quote: (node) => new TagNode("blockquote", node.attrs, node.content ?? ""),
    code: (node) => new TagNode("code", node.attrs, node.content ?? ""),
    color: (node) => new TagNode("span", { style: `color: ${getFirstAttribute(node)}` }, node.content ?? "")
});

function getFirstAttribute(node: TagNode) {
    return node.attrs[Object.keys(node.attrs)[0]];
}