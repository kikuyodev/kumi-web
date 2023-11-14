type RecordFromArray<Keys extends string[], Values extends unknown[], Result = object> =
  Keys extends []
    ? Result
    : Keys extends [infer K extends string, ...infer RestKeys extends string[]]
    ? Values extends [infer V, ...infer RestValues]
      ? RecordFromArray<RestKeys, RestValues, Result & Record<K, V>>
      : never
    : never;

export type ApiResponse<Keys extends string[], Values extends unknown[]> = {
    code: number;
    message?: string;
    data?: RecordFromArray<Keys, Values>;
    meta?: unknown;
}