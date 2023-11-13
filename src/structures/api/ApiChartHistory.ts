export interface ApiChartHistory {
    id: number;
    type: ApiChartHistoryType;
    alternate_message?: string;
    created_at?: string;
}

export enum ApiChartHistoryType {
    MetadataChanged,
    ChartAdded,
    ChartRemoved,

    ChartSetNominated,
    ChartSetQualified,
    ChartSetDisqualified,
    ChartSetRanked,
    ChartSetUnranked,

    ChartModdingPostDeleted,
    ChartModdingPostResolved,
    ChartModdingPostReopened
}