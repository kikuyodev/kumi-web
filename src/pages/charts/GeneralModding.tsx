import { TextBox } from "../../components/TextBox";
import { ApiModdingPost } from "../../structures/api/ApiModdingPost";
import "../../styles/pages/chart/generalModding.scss";

export function GeneralModding(_props: {
    posts: ApiModdingPost[] | undefined
}) {
    return <div class="general_modding">
        <TextBox placeholder="Type your discussion post here.">
            <button>Post</button>
        </TextBox>
    </div>;
}