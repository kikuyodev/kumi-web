import { Route, RouteDataFuncArgs } from "@solidjs/router";
import { createResource } from "solid-js";
import { lazily } from "solidjs-lazily";
import { Account } from "../structures/Account.ts";
import { ApiAccount } from "../structures/api/ApiAccount.ts";

const { UserPage } = lazily(() => import("../pages/userPage.tsx"));

export function UserData({ params, navigate }: RouteDataFuncArgs) {
    const [user] = createResource(() => params.id, async () => {
        const result = await Account.instance.client.requestSimple<{ account: ApiAccount }>(`/api/v1/accounts/${params.id}`, {
            method: "GET"
        }, {});

        if (result.code !== 200) {
            // TODO: tell the user the account doesn't exist.
            navigate("/404");
        }

        // TODO: fetch the "meta" data for the current account.
        //       (https://media.discordapp.net/attachments/1139952954070269982/1172331085980512256/Insomnia_erm6E93IdK.png)
        return result.data?.account;
    });

    return user;
}

export const UserRouteData = <Route path="/users/:id" component={UserPage} data={UserData} />;