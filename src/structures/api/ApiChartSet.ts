import { ApiAccount } from "./ApiAccount";
import { ApiModal } from "./ApiModal";

export interface ApiModalWithMetadata extends ApiModal {
    artist: string;
    title: string;
    source?: string;
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
    }
}

export interface ApiChartSet extends ApiModalWithMetadata {
    charts: ApiChart[];
    creator: ApiAccount;
}