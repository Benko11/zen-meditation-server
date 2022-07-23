export default function rgbToHsl(r: number, g: number, b: number): number[] {
    const divisions = [
        parseFloat((r / 255).toFixed(2)),
        parseFloat((g / 255).toFixed(2)),
        parseFloat((b / 255).toFixed(2)),
    ];

    const min = Math.min(...divisions);
    const max = Math.max(...divisions);
    const luminance = (min + max) / 2;

    let saturation: number = 0;
    if (min !== max) {
        if (luminance <= 0.5) saturation = (max - min) / (max + min);
        else saturation = (max - min) / (2 - max - min);
    }

    let hue: number = 0;
    if (min !== max) {
        // red is max
        if (divisions.indexOf(max) === 0) {
            hue = (divisions[1] - divisions[2]) / (max - min);
        }

        // green is max
        if (divisions.indexOf(max) == 1) {
            hue = 2 + (divisions[2] - divisions[0]) / (max - min);
        }

        // blue is max
        if (divisions.indexOf(max) == 2) {
            hue = 4 + (divisions[0] - divisions[1]) / (max - min);
        }
    }

    hue *= 60;
    while (hue < 0) hue += 360;

    return [
        Math.round(hue),
        parseFloat(saturation.toFixed(2)),
        parseFloat(luminance.toFixed(2)),
    ];
}
