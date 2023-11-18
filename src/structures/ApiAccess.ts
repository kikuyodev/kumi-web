import { ApiAccount, ApiGroup } from "./api/ApiAccount";
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

    public async getGroup(id: string | number) {
        const response = await this.rest.send<["group"], [ApiGroup]>(`/api/v1/groups/${id}`, {
            method: "GET",
            credentials: "include"
        });

        if (response.code === 200) {
            return response.data!.group;
        }
    }

    public async searchCharts(query: string) {
        const response = await this.rest.send<["results"], [ApiChartSet[]]>(`/api/v1/chartsets/search?query=${encodeURIComponent(query)}`, {
            method: "GET",
            credentials: "include"
        });

        if (response.code === 200) {
            return response;
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
            return response;
        }
    }

    public async sendModdingPost(id: string | number, body: Record<string, unknown>) {
        const response = await this.rest.send<["post"], [ApiModdingPost]>(`/api/v1/chartsets/${id}/modding`, {
            method: "POST",
            credentials: "include"
        }, body);


        if (response.code === 200) {
            return response.data!.post;
        }
    }

    public async editModdingPost(id: string | number, postId: string | number, message: string) {
        const response = await this.rest.send<["post"], [ApiModdingPost]>(`/api/v1/chartsets/${id}/modding/${postId}`, {
            method: "PATCH",
            credentials: "include"
        }, { message });

        if (response.code === 200) {
            return response.data!.post;
        }
    }
}