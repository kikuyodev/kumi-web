import { ApiAccount } from "./ApiAccount";
import { ApiModal } from "./ApiModal";

export interface ApiForum {
    id: number;
    name: string;
    description: string;
    order: number;
    private: boolean;
    is_category: boolean;
    parent?: ApiForum;
    last_thread: ApiThread;
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
}