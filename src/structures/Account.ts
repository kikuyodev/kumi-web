/* eslint-disable solid/reactivity */
import { Signal, createSignal } from "solid-js";
import { ApiAccount } from "./api/ApiAccount";
import { Debug } from "../util/Debug";
import { RestClient } from "../util/RestClient";

interface AccountState {
    login: Signal<boolean>
}

export class Account {
    public client: RestClient;
    public apiAccount?: ApiAccount;
    public state: AccountState;

    public get isLoggedIn() {
        return this.getState("login");
    }

    constructor(data?: ApiAccount) {
        this.client = new RestClient();

        this.state = {
            login: createSignal(false)
        };

        if (data) {
            this.apiAccount = data;
        }
    }

    public async login(username: string, password: string, rememberMe: boolean = false) {
        const response = await this.client.send<["account"], [account: ApiAccount]>("/api/v1/accounts/login", {
            method: "POST",
            credentials: "include"
        }, {
            username,
            password,
            rememberMe: rememberMe.toString()
        });

        if (response.code === 200) {
            this.apiAccount = response.data!.account;
            this.state.login[1](true);
            Debug.Assert(this.apiAccount != null, "Account is null");
        }

        return response;
    }

    public setState(key: keyof AccountState, value: unknown) {
        this.state[key][1](value as never);
    }

    public getState(key: keyof AccountState) {
        return this.state[key][0];
    }

    public async me() {
        try {
            const response = await this.client.send<["account"], [account: ApiAccount]>("/api/v1/accounts/me", {
                method: "GET",
                credentials: "include"
            });

            if (response.code === 200) {
                this.apiAccount = response.data!.account;
                this.setState("login", true);
            }
        } catch (e) {
            sessionStorage.setItem("logged_in", "false");
        }

        return response;
    }
}