import { ApiAccount } from "./ApiAccount";
import { ApiChartSet } from "./ApiChartSet";
import { ApiModdingPost } from "./ApiModdingPost";
import { RestClient } from "../../util/RestClient";

export class ApiAccess {
    private _restClient: RestClient;

    constructor() {
        this._restClient = new RestClient();
    }

    get rest() {
        return this._restClient;
    }

    public async getAccount(id: string | number) {
        const response = await this.rest.send<["account"], [ApiAccount]>(`/api/v1/accounts/${id}`, {
            method: "GET",
            credentials: "include"
        });

        if (response.code === 200) {
            return response.data!.account;
        }
    }

    public async getChartSet(id: string | number) {
        const response = await this.rest.send<["set"], [ApiChartSet]>(`/api/v1/chartsets/${id}`, {
            method: "GET",
            credentials: "include"
        });

        if (response.code === 200) {
            return response.data!.set;
        }
    }

    public async getModdingPosts(id: string | number) {
        const response = await this.rest.send<["posts"], [ApiModdingPost[]]>(`/api/v1/chartsets/${id}/modding`, {
            method: "GET",
            credentials: "include"
        });

        if (response.code === 200) {
            return response.data!.posts;
        }
    }
}