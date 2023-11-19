import { ApiAccount } from "./ApiAccount";
import { ApiChartSet } from "./ApiChartSet";
import { ApiModal } from "./ApiModal";

export interface ApiComment extends ApiModal {
    message: string;
    pinned: boolean;
    deleted: boolean;
    children: ApiComment[];
    author: ApiAccount;
    set?: ApiChartSet;
}