export class Colors {
    public static difficultyColorFor(difficulty: number) {
        if (difficulty < 1) {
            return "#373737";
        } else if (difficulty >= 10) {
            return "#000000";
        }

        const colors = [
            "#7ED8FF",
            "#73FFCD",
            "#6BFF8C",
            "#D7FF64",
            "#FFEE57",
            "#FFB978",
            "#FF5555",
            "#FF3F6D",
            "#CD3FFF",
            "#5124B0",
            "#000000"
        ];

        // interpolate the colors, in this case we have 11 colors but we want the range to be 1-10
        const color1 = colors[Math.floor(difficulty)];
        const color2 = colors[Math.ceil(difficulty)];
        const percent = difficulty % 1;

        return Colors.interpolateColor(color1, color2, percent);
    }

    public static difficultyTextColorFor(difficulty: number) {
        if (difficulty < 1 || difficulty > 8.7) {
            return "#FFFFFF";
        }

        return "var(--hsl-c5)";
    }

    public static interpolateColor(color1: string, color2: string, percent: number) {
        const color1Rgb = Colors.hexToRgb(color1);
        const color2Rgb = Colors.hexToRgb(color2);

        const r = Math.round(color1Rgb.r + percent * (color2Rgb.r - color1Rgb.r));
        const g = Math.round(color1Rgb.g + percent * (color2Rgb.g - color1Rgb.g));
        const b = Math.round(color1Rgb.b + percent * (color2Rgb.b - color1Rgb.b));

        return Colors.rgbToHex(r, g, b);
    }

    public static hexToRgb(hex: string) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)!;

        return {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        };
    }

    public static rgbToHex(r: number, g: number, b: number) {
        return "#" + [r, g, b].map(x => {
            const hex = x.toString(16);

            return hex.length === 1 ? "0" + hex : hex;
        }).join("");
    }
}