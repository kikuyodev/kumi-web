export type ApiAccount = {
    id: number;
    username: string;
    title?: string;
    created_at: Date;
    updated_at: Date;
    logged_in_at: Date;
    primary?: ApiGroup;
    groups: ApiGroup[];
};

export type ApiGroup = {
    id: number;
    identifier: string;
    name: string;
    tag: string;
    color: string;
    visible: boolean;
    priority: number;
    permissions: number;
    created_at: Date;
    updated_at: Date;
}