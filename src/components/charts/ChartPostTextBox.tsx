import { faAtom, faQuestion, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { Fa } from "solid-fa";
import { Accessor, Resource } from "solid-js";
import { useApi } from "../../contexts/ApiAccessContext";
import { ApiChart, ApiChartSet } from "../../structures/api/ApiChartSet";
import { ApiModdingPostType } from "../../structures/api/ApiModdingPost";
import { TextBox } from "../controls/TextBox";

interface ChartPostTextBoxProps {
    set: Resource<ApiChartSet | undefined>,
    chart: Accessor<ApiChart | undefined>,
    isTimeline?: boolean
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

        let timestamp = -1;

        // try and parse the timestamp from the text.
        // the expected format: mm:ss.ms
        const regex = /(\d+):(\d+)(?:\.(\d){3,3})/g;

        const match = regex.exec(textArea.value);

        if (match) {
            const minutes = parseInt(match[1]);
            const seconds = parseInt(match[2]);
            const ms = parseInt(match[3]);

            timestamp = ((minutes * 60 + seconds) * 1000) + ms;
        }

        if (timestamp === -1 && props.isTimeline) {
            // require a timestamp for timeline posts.
            return;
        }
        
        if (props.isTimeline) {
            if (timestamp === -1) {
                // require a timestamp for timeline posts.
                return;
            }

            if (props.chart() === undefined) {
                // require a chart for timeline posts.
                return;
            }
        }

        useApi(async (access) => {
            const body: any = {
                type: dataType,
                message: textArea!.value
            };

            if (props.isTimeline) {
                body.chart = props.chart()!.id;
                body["attributes[timestamp]"] = timestamp;
            } else if (props.chart() !== undefined) {
                body.chart = props.chart()!.id;
            }
            
            const post = await access.sendModdingPost(props.set()!.id, body);
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