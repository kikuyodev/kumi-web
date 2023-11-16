import { ApiAccount } from "./ApiAccount";
import { ApiModal } from "./ApiModal";

export interface ApiModalWithMetadata extends ApiModal {
    artist: string;
    title: string;
    source?: string;
    tags?: string;
    romanised_metadata?: {
        artist_romanised?: string;
        title_romanised?: string;
        source_romanised?: string;
    }
}

export interface ApiChart extends ApiModalWithMetadata {
    difficulty_name: string;
    creators: ApiAccount[];
    tags: string;
    difficulty: {
        bpms: number[];
        difficulty: number;
    };
    statistics: {
        note_count: number;
        drain_length: number;
        total_length: number;
        music_length: number;
    }
}

export interface ApiChartSet extends ApiModalWithMetadata {
    description?: string;
    charts: ApiChart[];
    creator: ApiAccount;
    nominators: ApiAccount[];
    attributes: {
        is_unavailable: boolean;
        unavailable_reason?: string;
        nominators_required: number;
    }
    status: ApiChartSetStatus;
    ranked_on?: string;
}

export enum ApiChartSetStatus {
    WorkInProgress,
    Pending,
    Ranked,
    Qualified,
    Graveyard
}