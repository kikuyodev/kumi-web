import { ApiAccount } from "./api/ApiAccount";
import { Debug } from "../util/Debug";
import { RestClient } from "../util/RestClient";

export class Account {
    public static instance: Account;

    public client: RestClient;
    public apiAccount?: ApiAccount;

    public get isLoggedIn() {
        return this.apiAccount !== undefined;
    }

    constructor(data?: ApiAccount) {
        this.client = new RestClient();

        if (data) {
            this.apiAccount = data;
        }
    }

    public async login(username: string, password: string, rememberMe: boolean = false) {
        const response = await this.client.requestSimple<{ account: ApiAccount }>("/api/v1/accounts/login", {
            method: "POST",
            credentials: "include"
        }, {
            username,
            password,
            rememberMe: rememberMe.toString()
        });

        if (response.code === 200) {
            this.apiAccount = response.data!.account;
            Debug.Assert(this.apiAccount != null, "Account is null");
        }

        return response;
    }
}