type RecordFromArray<Keys extends string[], Values extends unknown[], Result = object> =
    Keys extends []
        ? Result
        : Keys extends [infer K extends string, ...infer RestKeys extends string[]]
        ? Values extends [infer V, ...infer RestValues]
            ? RecordFromArray<RestKeys, RestValues, Result & Record<K, V>>
            : never
        : never;
        
export interface PaginationMeta {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    first_page: number;
    first_page_url: string;
    last_page_url: string;
    next_page_url?: string;
    previous_page_url?: string;
}

export class ApiResponse<Keys extends string[], Values extends unknown[]> {
    public code: number;
    public message?: string;
    public data?: RecordFromArray<Keys, Values>;
    public meta?: unknown;

    constructor(code: number, message?: string, data?: RecordFromArray<Keys, Values>, meta?: unknown) {
        this.code = code;
        this.message = message;
        this.data = data;
        this.meta = meta;
    }

    public get isSuccess(): boolean {
        return this.code >= 200 && this.code < 300;
    }

    public get isFailure(): boolean {
        return !this.isSuccess;
    }

    public parseMeta<T>(): T {
        return this.meta as T;
    }
}