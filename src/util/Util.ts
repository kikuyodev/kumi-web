export class Util {
    public static getCdnFor(location: string, id?: string | number) {
        return new URL(`/cdn/${location}${id ? `/${id}` : ""}`, import.meta.env.KUMI_API_URL).toString();
    }
}