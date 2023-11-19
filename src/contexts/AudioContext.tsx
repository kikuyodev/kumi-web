import { Context, ParentProps, createContext, createSignal, useContext } from "solid-js";
import { GlobalAudio } from "../structures/GlobalAudio";

const GlobalAudioContext: Context<GlobalAudio> = createContext(new GlobalAudio());

export function GlobalAudioProvider(props: ParentProps) {
    const [audio] = createSignal(new GlobalAudio());

    return <GlobalAudioContext.Provider value={audio()}>
        {props.children}
    </GlobalAudioContext.Provider>;
}

export function useGlobalAudio() {
    return useContext(GlobalAudioContext);
}