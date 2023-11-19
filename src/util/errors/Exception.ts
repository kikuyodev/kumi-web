export class Exception extends Error {
    constructor(message: string, public code: number) {
        super(message);
        this.name = "Exception";
    }
}