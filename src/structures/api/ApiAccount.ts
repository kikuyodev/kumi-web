export interface ApiRankingHistory {
    timestamp: string;
    ranks: {
        global_rank: number;
        country_rank: number;
    }
}

export type ApiAccount = {
    id: number;
    username: string;
    title?: string;
    biography?: string;
    status: "online" | "offline";
    created_at: Date;
    updated_at: Date;
    logged_in_at: Date;
    primary?: ApiGroup;
    groups: ApiGroup[];
    badges: ApiBadge[];
    country: {
        code: string;
        name: string;
        native: string;
    };
    statistics: {
        ranked_score: string;
        total_score: string;
        total_playtime: number;
        total_playcount: number;
        maximum_combo: number;
    };
    forum_statistics: {
        level: number;
        exp: number;
        reputation: number;
        posts?: number;
    };
    ranking: {
        global_rank: number;
        country_rank: number;
        history: ApiRankingHistory[]
    }
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
    description?: string;
    created_at: Date;
    updated_at: Date;
}

export type ApiBadge = {
    id: number;
    name: string;
    description: string;
    asset_url: string;
    awarded_at?: Date;
}