import { IntlProvider } from "@cookbook/solid-intl";
import { ParentProps, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

export type IntlProviderWrapperContextStore = {
    name: string;
    locale: string;
    messages: Record<string, string>;
    actions: {
        setLocale: (key: LocaleUnion) => void;
    }
}

export const possibleLocales = [
    { name: "English", locale: "en-US", messages: await import("../../intl/locales/en-US.json") },
] as const;

const initialData = possibleLocales[0];

type LocaleUnion = typeof possibleLocales[number]["locale"];

export const IntlContext = createContext<IntlProviderWrapperContextStore>();

export function IntlProviderWrapperContext(props: ParentProps) {
    const setLocale = (key: LocaleUnion) => {
        // look for the locale in the possible locales
        const locale = possibleLocales.find(x => x.locale === key);

        if (!locale) {
            throw new Error(`Locale ${key} not found`);
        }
        
        updateStore("name", () => locale.name);
        updateStore("locale", () => locale.locale);
        updateStore("messages", () => convertLocaleFileToMessages(locale.messages));
    };

    const [store, updateStore] = createStore<IntlProviderWrapperContextStore>({
        name: initialData.name,
        locale: initialData.locale,
        messages: convertLocaleFileToMessages(initialData.messages), // todo
        actions: {
            setLocale
        }
    });

    return (
        <IntlContext.Provider value={store}>
            <IntlProvider locale={store.locale} messages={store.messages}>
                {props.children}
            </IntlProvider>
        </IntlContext.Provider>
    );
}

export function useLocale() {
    return useContext(IntlContext);
}

function convertLocaleFileToMessages(file: Record<string, object>) {
    const messages: Record<string, string> = {};

    // go through the defaults first.
    for (const key in file.default) {
        messages[key] = (file.default as Record<string, { defaultMessage: string }>)[key].defaultMessage;
    }

    return messages;
}