/* eslint-disable solid/reactivity */
import { Context, ParentProps, ResourceSource, createContext, createResource, createSignal, useContext } from "solid-js";
import { ApiAccess } from "../structures/ApiAccess";

const [_ACCESSS] = createSignal(new ApiAccess());
const ApiAccessContext: Context<ApiAccess | undefined> = createContext<ApiAccess>(_ACCESSS());

export function ApiAccessProvider(props: ParentProps) {
    return (
        <ApiAccessContext.Provider value={_ACCESSS()}>
            {props.children}
        </ApiAccessContext.Provider>
    );
}

export function useAccess() {
    return useContext(ApiAccessContext)!;
}

export function useApi<T>(func: (access: ApiAccess) => Promise<T>, source?: ResourceSource<unknown>) {
    async function promise() {
        return await func(useContext(ApiAccessContext)!);
    }

    const [ result ] = source ?
        createResource(source, promise) :
        createResource(promise);

    return result;
}