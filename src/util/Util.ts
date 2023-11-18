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

    /**
     * Convert a date to a relative time string, such as
     * "a minute ago", "in 2 hours", "yesterday", "3 months ago", etc.
     * using Intl.RelativeTimeFormat
     */
    static getRelativeTimeString(
        date: Date | number,
        lang = navigator.language
    ): string {
        // Allow dates or times to be passed
        const timeMs = typeof date === "number" ? date : date.getTime();

        // Get the amount of seconds between the given date and now
        const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);

        // Array reprsenting one minute, hour, day, week, month, etc in seconds
        const cutoffs = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity];

        // Array equivalent to the above but in the string representation of the units
        const units: Intl.RelativeTimeFormatUnit[] = ["second", "minute", "hour", "day", "week", "month", "year"];

        // Grab the ideal cutoff unit
        const unitIndex = cutoffs.findIndex(cutoff => cutoff > Math.abs(deltaSeconds));

        // Get the divisor to divide from the seconds. E.g. if our unit is "day" our divisor
        // is one day in seconds, so we can divide our seconds by this to get the # of days
        const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;

        // Intl.RelativeTimeFormat do its magic
        const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
        return rtf.format(Math.floor(deltaSeconds / divisor), units[unitIndex]);
    }

    static formatTimestamp(timestamp: number) {
        // expected format: 00:00.000
        const minutes = Math.floor(timestamp / 60000);
        const seconds = Math.floor(timestamp / 1000) - minutes * 60;
        const ms = Math.floor(timestamp % 1000);
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static debounce<T extends (...args: any[]) => any>(func: T, wait: number) {
        let timeout: NodeJS.Timeout;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const debounced = (...args: Parameters<T>) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };

        return debounced as (...args: Parameters<T>) => ReturnType<T>;
    }
}