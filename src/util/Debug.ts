export class Debug {
    private constructor() { }

    public static Assert(condition: boolean, message?: string) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (!import.meta.env.DEV) {
            return;
        }

        if (!condition) {
            throw new Error(message ?? "Assertion failed");
        }
    }
}