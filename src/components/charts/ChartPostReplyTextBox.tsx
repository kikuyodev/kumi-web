import { faAtom, faQuestion, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import Fa from "solid-fa";
import { Resource } from "solid-js";
import { useApi } from "../../contexts/ApiAccessContext";
import { ApiChartSet } from "../../structures/api/ApiChartSet";
import { ApiModdingPost, ApiModdingPostType } from "../../structures/api/ApiModdingPost";

export interface ChartPostReplyTextBoxProps {
    set: Resource<ApiChartSet | undefined>,
    parent: ApiModdingPost,
}

export function ChartPostReplyTextBox(props: ChartPostReplyTextBoxProps) {
    let textArea: HTMLTextAreaElement | undefined = undefined;
    
    const onClick = () => {
        if (textArea?.value === undefined || textArea?.value === "") {
            return;
        }


        useApi(async (access) => {
            // unused
        });
    }

    return (
        <div class="general_modding--textbox">
            <textarea ref={textArea} placeholder={"test"} rows={2} />
            <div class="general_modding--textbox-buttons">
                <button
                    class="general_modding--textbox-button general_modding--textbox-button-praise"
                    onClick={() => onClick("praise")}
                >
                    <Fa icon={faAtom} /> Praise
                </button>
                <button
                    class="general_modding--textbox-button general_modding--textbox-button-suggestion"
                    onClick={() => onClick("suggestion")}
                >
                    <Fa icon={faQuestion} /> Suggestion
                </button>
                <button
                    class="general_modding--textbox-button general_modding--textbox-button-problem"
                    onClick={() => onClick("problem")}
                >
                    <Fa icon={faTimesCircle} /> Problem
                </button>
            </div>
        </div>
    );
}