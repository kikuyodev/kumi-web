import { Resource } from "solid-js";
import { TextBox } from "../../components/TextBox";
import { ApiModdingPost } from "../../structures/api/ApiModdingPost";
import "../../styles/pages/chart/generalModding.scss";

export function GeneralModding(_props: {
    posts: Resource<ApiModdingPost[] | undefined>
}) {
    return <div class="general_modding">
        <TextBox placeholder="Type your discussion post here.">
            <button>Post</button>
        </TextBox>
    </div>;
}