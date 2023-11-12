/* eslint-disable solid/reactivity */
import { Context, ParentProps, createContext, createSignal, useContext } from "solid-js";
import { Account } from "../structures/Account";

const [_ACCOUNT] = createSignal(new Account());
const AccountContext: Context<Account> = createContext(_ACCOUNT());

export function AccountProvider(props: ParentProps) {
    return (
        <AccountContext.Provider value={_ACCOUNT()}>
            {props.children}
        </AccountContext.Provider>
    );
}

export function useAccount() {
    return useContext(AccountContext);
}