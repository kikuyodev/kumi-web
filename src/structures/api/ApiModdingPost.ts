import { ApiAccount } from "./ApiAccount";
import { ApiModal } from "./ApiModal";

export interface ApiModdingPost extends ApiModal {
    message: string;
    type: ApiModdingPostType;
    status: ApiModdingPostStatus;
    attributes: ApiModdingPostAttributes;
    author: ApiAccount;
    editor?: ApiAccount;
    done_by?: ApiAccount; // only for system posts

    has_parent: boolean;
    is_edited: boolean;
    parent?: ApiModdingPost;
    children: ApiModdingPost[];
}

export interface ApiModdingPostAttributes {
    resolved?: boolean;
    reopened?: boolean;
    muted?: boolean;
}

export enum ApiModdingPostType {
    Note,
    Suggestion,
    Comment,
    Problem,
    Praise,
    Reply,
    System
}

export enum ApiModdingPostStatus {
    None,
    Resolved,
    Open
}