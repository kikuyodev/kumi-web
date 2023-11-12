export class Util {
    public static getCdnFor(location: string, id?: string | number, settings?: Record<string, string | number | boolean>) {
        const url = new URL(`/cdn/${location}${id ? `/${id}` : ""}`, import.meta.env.KUMI_API_URL);

        if (settings) {
            for (const [key, value] of Object.entries(settings)) {
                url.searchParams.set(key, value.toString());
            }
        }

        return url.toString();
    }
}