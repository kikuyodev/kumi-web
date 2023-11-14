import { ApiAccount } from "./ApiAccount";

export interface ApiChartHistory {
    id: number;
    type: ApiChartHistoryType;
    alternate_message?: string;
    created_at?: string;
    player?: ApiAccount;
}

export enum ApiChartHistoryType {
    MetadataChanged,
    ChartAdded,
    ChartRemoved,

    ChartSetNominated,
    ChartSetQualified,
    ChartSetDisqualified,
    ChartSetReset,
    ChartSetRanked,
    ChartSetUnranked,

    ChartModdingPostDeleted,
    ChartModdingPostResolved,
    ChartModdingPostReopened
}