import { ApiResponse } from "./api/ApiResponse";
import { ApiResponseError } from "./errors/ApiResponseError";

export class RestClient {
    public async requestSimple<T = object>(url: string, request: RequestInit, body: Record<string, string>) {
        if (request.method !== "GET" && request.method !== "HEAD") {
            const formData = new FormData();

            for (const [key, value] of Object.entries(body)) {
                formData.append(key, value as string);
            }

            request.body = formData;
        }

        return await this.request<T>(url, request);
    }

    public async request<T = object>(url: string, request: RequestInit) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const absoluteUrl = new URL(url, import.meta.env.KUMI_API_URL);
        const response = await fetch(absoluteUrl.toString(), request);

        if (response.status === 200) {
            return await response.json() as ApiResponse<T>;
        } else if (response.status >= 500) {
            throw new ApiResponseError(response.status, "Internal server error", await response.text());
        } else {
            const data = await response.json() as ApiResponse<T>;
            throw new ApiResponseError(response.status, data.message ?? JSON.stringify(data));
        }
    }
}