import remarkGfm from "remark-gfm";
import { ParentProps } from "solid-js";
import { SolidMarkdown } from "solid-markdown";

export function Markdown(props: ParentProps) {
    return <SolidMarkdown class="_markdown_" remarkPlugins={[remarkGfm]}>{props.children! as string}</SolidMarkdown>;
}
