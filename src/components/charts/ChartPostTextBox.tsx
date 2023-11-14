import { faAtom, faQuestion, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { Fa } from "solid-fa";
import { Resource } from "solid-js";
import { useApi } from "../../contexts/ApiAccessContext";
import { ApiChartSet } from "../../structures/api/ApiChartSet";
import { ApiModdingPostType } from "../../structures/api/ApiModdingPost";
import { TextBox } from "../controls/TextBox";

interface ChartPostTextBoxProps {
    set: Resource<ApiChartSet | undefined>,
}

export function ChartPostTextBox(props: ChartPostTextBoxProps) {
    let textArea: HTMLTextAreaElement | undefined = undefined;

    const onClick = (type: "praise" | "suggestion" | "problem") => {
        if (textArea?.value === undefined || textArea?.value === "") {
            return;
        }

        let dataType: ApiModdingPostType;

        if (type === "praise") {
            dataType = ApiModdingPostType.Praise;
        } else if (type === "suggestion") {
            dataType = ApiModdingPostType.Suggestion;
        } else if (type === "problem") {
            dataType = ApiModdingPostType.Problem;
        }

        useApi(async (access) => {
            const post = await access.sendModdingPost(props.set()!.id, {
                type: dataType,
                message: textArea!.value
            });

            if (post) {
                // refresh the page.
                window.location.reload();
            }
        });
    };

    return (
        <TextBox ref={textArea} placeholder={"Type your discussion post here"} rows={2}>
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
        </TextBox>
    );
}