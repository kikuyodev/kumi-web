import { ApiAccount } from "./ApiAccount";
import { ApiModal } from "./ApiModal";

export enum ForumThreadFlags {
    Lock = 1 << 0,
    Pin = 1 << 1
}

export interface ApiForum {
    id: number;
    name: string;
    description: string;
    order: number;
    private: boolean;
    is_category: boolean;
    color?: string;
    parent?: ApiForum;
    last_thread?: ApiThread;
    children: ApiForum[];
}

export interface ApiThread extends ApiModal {
    title: string;
    forum: ApiForum;
    flags: number;
    metadata: Record<string, unknown>;
    author: ApiAccount;
    posts?: ApiThreadPost[];
    last_post?: ApiThreadPost;
}

export interface ApiThreadPost extends ApiModal {
    body: string;
    author: ApiAccount;
    editor?: ApiAccount;
    deleted: boolean;
    deleted_at?: string;
}
