import { RouteDataFuncArgs } from "@solidjs/router";
import { useApi } from "../contexts/ApiAccessContext";

export function AccountData({ params }: RouteDataFuncArgs) {
    const result = useApi(async (access) => access.account.getAccount(params.id));

    // TODO: fetch the "meta" data for the current account.
    //       (https://media.discordapp.net/attachments/1139952954070269982/1172331085980512256/Insomnia_erm6E93IdK.png)
    return result;
}