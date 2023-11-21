import { ApiAccount, ApiGroup } from "./api/ApiAccount";
import { ApiChartHistory } from "./api/ApiChartHistory";
import { ApiChartSet } from "./api/ApiChartSet";
import { ApiComment } from "./api/ApiComment";
import { ApiForum, ApiThread, ApiThreadPost } from "./api/ApiForum";
import { ApiModdingPost } from "./api/ApiModdingPost";
import { RestClient } from "../util/RestClient";

export class ApiAccess {
    private _restClient: RestClient;

    public account: AccountApiAccess = new AccountApiAccess(this);
    public chart: ChartApiAccess = new ChartApiAccess(this);
    public modding: ModdingApiAccess = new ModdingApiAccess(this);
    public forum: ForumApiAccess = new ForumApiAccess(this);

    constructor() {
        this._restClient = new RestClient();
    }

    get rest() {
        return this._restClient;
    }
}

class AccountApiAccess {
    private access: ApiAccess;

    constructor(access: ApiAccess) {
        this.access = access;
    }

    public async getAccount(id: string | number) {
        const response = await this.access.rest.send<["account"], [ApiAccount]>(`/api/v1/accounts/${id}`, {
            method: "GET",
            credentials: "include"
        });

        if (response.code === 200) {
            return response.data!.account;
        }
    }

    public async getGroup(id: string | number) {
        const response = await this.access.rest.send<["group", "members"], [ApiGroup, ApiAccount[]]>(`/api/v1/groups/${id}`, {
            method: "GET",
            credentials: "include"
        });

        if (response.code === 200) {
            return {
                group: response.data!.group,
                members: response.data!.members
            };
        }
    }
}

class ChartApiAccess {
    private access: ApiAccess;

    constructor(access: ApiAccess) {
        this.access = access;
    }

    public async searchCharts(query: string) {
        const response = await this.access.rest.send<["results"], [ApiChartSet[]]>(`/api/v1/chartsets/search?query=${encodeURIComponent(query)}`, {
            method: "GET",
            credentials: "include"
        });

        if (response.code === 200) {
            return response;
        }
    }

    public async getChartSet(id: string | number) {
        const response = await this.access.rest.send<["set"], [ApiChartSet]>(`/api/v1/chartsets/${id}`, {
            method: "GET",
            credentials: "include"
        });

        if (response.code === 200) {
            return response.data!.set;
        }
    }

    public async getChartSets(id: string | number) {
        const response = await this.access.rest.send<["charts"], [ApiChartSet[]]>(`/api/v1/accounts/${id}/chartsets`, {
            method: "GET",
            credentials: "include"
        });

        if (response.code === 200) {
            return response.data!.charts;
        }
    }

    public async nominateChartSet(id: string | number) {
        const response = await this.access.rest.send<["set"], [ApiChartSet]>(`/api/v1/chartsets/${id}/nominations`, {
            method: "POST",
            credentials: "include"
        });

        if (response.code === 200) {
            return response.data!.set;
        }
    }

    public async getChartSetComments(id: string | number) {
        const response = await this.access.rest.send<["comments"], [ApiComment[]]>(`/api/v1/chartsets/${id}/comments`, {
            method: "GET",
            credentials: "include"
        });

        if (response.code === 200) {
            return response;
        }
    }

    public async sendChartSetComment(id: string | number, body: Record<string, unknown>) {
        const response = await this.access.rest.send<["comment"], [ApiComment]>(`/api/v1/chartsets/${id}/comments`, {
            method: "POST",
            credentials: "include"
        }, body);

        if (response.code === 200) {
            return response.data!.comment;
        }
    }

    public async deleteChartSetComment(id: string | number, commentId: string | number) {
        const response = await this.access.rest.send<["comment"], [ApiComment]>(`/api/v1/chartsets/${id}/comments/${commentId}`, {
            method: "DELETE",
            credentials: "include"
        });

        if (response.code === 200) {
            return response.data!.comment;
        }
    }

    public async editChartSetComment(id: string | number, commentId: string | number, message: string) {
        const response = await this.access.rest.send<["comment"], [ApiComment]>(`/api/v1/chartsets/${id}/comments/${commentId}`, {
            method: "PATCH",
            credentials: "include"
        }, { message });

        if (response.code === 200) {
            return response.data!.comment;
        }
    }

    public async pinChartSetComment(id: string | number, commentId: string | number) {
        const response = await this.access.rest.send<["comment"], [ApiComment]>(`/api/v1/chartsets/${id}/comments/${commentId}/pin`, {
            method: "PATCH",
            credentials: "include"
        });

        if (response.code === 200) {
            return response.data!.comment;
        }
    }
}

class ModdingApiAccess {
    private access: ApiAccess;

    constructor(access: ApiAccess) {
        this.access = access;
    }

    public async getModdingData(id: string | number) {
        const response = await this.access.rest.send<["posts", "events"], [ApiModdingPost[], ApiChartHistory[]]>(`/api/v1/chartsets/${id}/modding`, {
            method: "GET",
            credentials: "include"
        });

        if (response.code === 200) {
            return response;
        }
    }

    public async sendModdingPost(id: string | number, body: Record<string, unknown>) {
        const response = await this.access.rest.send<["post"], [ApiModdingPost]>(`/api/v1/chartsets/${id}/modding`, {
            method: "POST",
            credentials: "include"
        }, body);


        if (response.code === 200) {
            return response.data!.post;
        }
    }

    public async editModdingPost(id: string | number, postId: string | number, message: string) {
        const response = await this.access.rest.send<["post"], [ApiModdingPost]>(`/api/v1/chartsets/${id}/modding/${postId}`, {
            method: "PATCH",
            credentials: "include"
        }, { message });

        if (response.code === 200) {
            return response.data!.post;
        }
    }
}

class ForumApiAccess {
    private access: ApiAccess;

    constructor(access: ApiAccess) {
        this.access = access;
    }

    public async getForums() {
        const response = await this.access.rest.send<["forums"], [ApiForum[]]>("/api/v1/forums", {
            method: "GET",
            credentials: "include"
        });

        if (response.code === 200) {
            return response.data!.forums;
        }
    }

    // public async createForum(body: Record<string, unknown>) {
    //     const response = await this.access.rest.send<["forum"], [ApiForum]>("/api/v1/forums", {
    //         method: "POST",
    //         credentials: "include"
    //     }, body);

    //     if (response.code === 200) {
    //         return response.data!.forum;
    //     }
    // }

    public async getForum(id: string | number) {
        const response = await this.access.rest.send<["forum"], [ApiForum]>(`/api/v1/forums/${id}`, {
            method: "GET",
            credentials: "include"
        });

        if (response.code === 200) {
            return response.data!.forum;
        }
    }

    public async getForumThreads(id: string | number) {
        const response = await this.access.rest.send<["threads"], [ApiThread[]]>(`/api/v1/forums/${id}/threads`, {
            method: "GET",
            credentials: "include"
        });

        if (response.code === 200) {
            return response;
        }
    }

    public async getForumThread(threadId: string | number) {
        const response = await this.access.rest.send<["thread"], [ApiThread]>(`/api/v1/forums/threads/${threadId}`, {
            method: "GET",
            credentials: "include"
        });

        if (response.code === 200) {
            return response.data!.thread;
        }
    }

    public async getPosts(threadId: string | number, page: number = 1) {
        const response = await this.access.rest.send<["posts"], [ApiThreadPost[]]>(`/api/v1/forums/threads/${threadId}/posts?page=${page}`, {
            method: "GET",
            credentials: "include"
        });

        if (response.code === 200) {
            return response;
        }
    }
}
