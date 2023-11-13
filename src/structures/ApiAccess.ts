import { ApiAccount } from "./api/ApiAccount";
import { ApiChartHistory } from "./api/ApiChartHistory";
import { ApiChartSet } from "./api/ApiChartSet";
import { ApiModdingPost } from "./api/ApiModdingPost";
import { RestClient } from "../util/RestClient";

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

    public async getModdingData(id: string | number) {
        const response = await this.rest.send<["posts", "events"], [ApiModdingPost[], ApiChartHistory[]]>(`/api/v1/chartsets/${id}/modding`, {
            method: "GET",
            credentials: "include"
        });

        if (response.code === 200) {
            return response.data!;
        }
    }

    public async sendModdingPost(id: string | number, body: Record<string, unknown>) {
        console.log("nya");
        const response = await this.rest.send<["post"], [ApiModdingPost]>(`/api/v1/chartsets/${id}/modding`, {
            method: "POST",
            credentials: "include"
        }, body);


        if (response.code === 200) {
            return response.data!.post;
        }
    }
}