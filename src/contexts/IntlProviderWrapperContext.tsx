import { IntlProvider } from "@cookbook/solid-intl";
import { ParentProps, Setter, Signal, createContext, createMemo, createSignal, useContext } from "solid-js";

export const possibleLocales = [
    { name: "English", locale: "en-US", messages: await import("../../intl/locales/en-US.json") },
] as const;

type IntlValue = Signal<string | undefined>;
const IntlContext = createContext<IntlValue>(undefined);

export function IntlProviderWrapperContext(props: ParentProps) {
    let [ locale, setLocale ] = createSignal<string | undefined>();

    function setter() {
        const stored = localStorage.getItem("locale");

        if (stored) {
            return stored;
        }

        const language = navigator.language;
        const internalLocale = possibleLocales.find(x => x.locale === language);
        if (internalLocale) {
            return internalLocale?.locale;
        }

        return "en-US";
    }

    const provider = createMemo(() => [
        locale,
        (key: string) => {
            localStorage.setItem("locale", key ?? "en-US");
            setLocale(key);

            return locale();
        }
    ], [locale()]);
    
    const messages = createMemo(() => possibleLocales.find(x => x.locale === locale())?.messages, [locale()])

    return (
        <IntlContext.Provider value={provider()}>
            <IntlProvider locale={locale() ?? "en-US"} messages={messages()?.default!}>
                {props.children}
            </IntlProvider>
        </IntlContext.Provider>
    ) ;
}

export function useLocale(): IntlValue {
    return useContext(IntlContext)!;
}