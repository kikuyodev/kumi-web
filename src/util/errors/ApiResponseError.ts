export class ApiResponseError extends Error {
    public code: number;

    constructor(code: number, message: string, public cause?: string) {
        super(message);

        this.name = "ApiResponseError";
        this.code = code;
    }
}