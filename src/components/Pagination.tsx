import { Accessor, For, Show, createMemo } from "solid-js";
import { PaginationMeta } from "../util/api/ApiResponse";
import styles from "../styles/components/pagination.module.scss";
import { Fa } from "solid-fa";
import { faAngleDoubleLeft, faAngleDoubleRight, faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

export function Pagination(props: {
    meta: Accessor<PaginationMeta | undefined>;
    requestPage?: (page: number) => void;
}) {
    const shouldRender = createMemo(() => {
        if (props.meta() === undefined) {
            return false;
        }

        return props.meta()!.total > props.meta()!.per_page;
    });

    const pages = createMemo(() => {
        if (props.meta() === undefined) {
            return [];
        }
        
        // Creates an array of numbers from 1 to 9, showing the current page in the middle
        // We're not guaranteed to have 9 pages, but this is the maximum amount of pages we can show
        const pages = [];
        const currentPage = props.meta()!.current_page;
        const lastPage = props.meta()!.last_page;

        let start = currentPage - 4;
        let end = currentPage + 4;

        if (start < 1) {
            end += 1 - start;
            start = 1;
        }

        if (end > lastPage) {
            start -= end - lastPage;
            end = lastPage;
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        // truncate the array if we have more than 9 pages
        if (pages.length > 9) {
            pages.splice(0, pages.length - 9);
        }

        // remove any negative numbers, including 0
        pages.splice(0, pages.indexOf(1));

        return pages;
    });

    return <Show when={shouldRender()}>
        <div class={styles.pagination}>
            <button disabled={props.meta()?.current_page === props.meta()?.first_page} onClick={() => props.requestPage?.(props.meta()!.first_page)}>
                <Fa icon={faAngleDoubleLeft} />
            </button>
            <button disabled={props.meta()?.current_page === props.meta()?.first_page} onClick={() => props.requestPage?.(props.meta()!.current_page - 1)}>
                <Fa icon={faAngleLeft} />
            </button>
            <For each={pages()}>
                {page =>
                    <button class={page === props.meta()?.current_page ? styles.active : ""} onClick={() => props.requestPage?.(page)}>
                        {page}
                    </button>
                }
            </For>
            <button disabled={props.meta()?.current_page === props.meta()?.last_page} onClick={() => props.requestPage?.(props.meta()!.current_page + 1)}>
                <Fa icon={faAngleRight} />
            </button>
            <button disabled={props.meta()?.current_page === props.meta()?.last_page} onClick={() => props.requestPage?.(props.meta()!.last_page)}>
                <Fa icon={faAngleDoubleRight} />
            </button>
        </div>
    </Show>;
}