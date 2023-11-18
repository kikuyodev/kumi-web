import twemoji from "twemoji";

export class EmojiUtil {
    public static getFlagEmoji(code: string) {
        const codePoints = code
            .toUpperCase()
            .split("")
            .map(char => 127397 + char.charCodeAt(0));

        const unicode = String.fromCodePoint(...codePoints);
        return twemoji.parse(unicode);
    }
}