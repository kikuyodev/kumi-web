import { useParams } from "@solidjs/router";
import { TextBox } from "../../components/controls/TextBox";
import "../../styles/pages/forums/threadCreate.scss";
import { useApi } from "../../contexts/ApiAccessContext";
import { ApiResponseError } from "../../util/errors/ApiResponseError";

export function ThreadCreate() {
    const params = useParams();

    let title: HTMLInputElement | undefined = undefined;
    let content: HTMLTextAreaElement | undefined = undefined;
    let error: HTMLParagraphElement | undefined = undefined;

    function create() {
        if (title === undefined || content === undefined || error === undefined) {
            return;
        }

        if (title.value.length < 5) {
            error.textContent = "Title must be at least 5 characters.";
            return;
        }

        if (content.value.length < 10) {
            error.textContent = "Content must be at least 10 characters.";
            return;
        }

        error.textContent = "";
        useApi(async api => {
            try {
                const result = await api.forum.createForumThread(params.id, {
                    title: title!.value,
                    body: content!.value
                });

                window.location.href = `/forums/threads/${result!.id}`;
            } catch (e) {
                if (e instanceof ApiResponseError) {
                    error!.textContent = e.message;
                    return;
                }

                throw e;
            }
        });
    }

    return <div class="thread_create">
        <div class="thread_create--content">
            <div class="thread_create--content-header">
                <h1>Thread</h1>
                <p>•</p>
                <p>Create</p>
            </div>
            <div class="thread_create--content-body">
                <div class="thread_create--content-body-form">
                    <div class="thread_create--content-body-form-group">
                        <p>Title</p>
                        <input ref={title} type="text" placeholder="Title" />
                    </div>
                    <div class="thread_create--content-body-form-group">
                        <p>Content</p>
                        <TextBox ref={content} placeholder="Your initial post thread content.">
                            <div class="thread_create--content-body-form-group--textbox">
                                <div class="thread_create--content-body-form-group--textbox-format">BBCode</div>
                            </div>
                        </TextBox>
                    </div>
                </div>
                <div class="thread_create--content-body-buttons">
                    <p ref={error} class="thread_create--content-body-buttons-error" />
                    <button class="thread_create--content-body-buttons-cancel" onClick={() => window.location.href = `/forums/${params.id}`}>Cancel</button>
                    <button class="thread_create--content-body-buttons-create" onClick={() => create()}>Create</button>
                </div>
            </div>
        </div>
    </div>;
}