export class Debug {
    private constructor() { }

    public static Assert(condition: boolean, message?: string) {
        if (!import.meta.env.DEV) {
            return;
        }

        if (!condition) {
            throw new Error(message ?? "Assertion failed");
        }
    }
}