import { ApiResponse } from "./api/ApiResponse";
import { ApiResponseError } from "./errors/ApiResponseError";

export class RestClient {
    public async send<
        Keys extends string[],
        Values extends unknown[]
    >(url: string, request: RequestInit, body?: Record<string, unknown>): Promise<ApiResponse<Keys, Values>> {
        const absoluteUrl = new URL(url, import.meta.env.KUMI_API_URL);
        if (request.method !== "GET" && request.method !== "HEAD") {
            const formData = new FormData();

            for (const [key, value] of Object.entries(body ?? {})) {
                formData.append(key, value as string);
            }

            request.body = formData;
        }

        const response = await fetch(absoluteUrl.toString(), request);

        if (response.status === 200) {
            const json = await response.json();
            return new ApiResponse<Keys, Values>(response.status, json.message, json.data, json.meta);
        } else if (response.status >= 500) {
            throw new ApiResponseError(response.status, "Internal server error", await response.text());
        } else {
            const data = await response.json(); // TODO: Address errors array
            throw new ApiResponseError(response.status, data.message ?? JSON.stringify(data));
        }
    }
}