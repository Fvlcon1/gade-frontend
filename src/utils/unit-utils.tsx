/**
 * Formats a number with metric prefixes (K, M, B, T) and optional unit.
 * Works for values like area, bytes, currency, etc.
 * 
 * @param value - The numeric value to format
 * @param unit - Optional unit suffix to append (e.g. 'km²', 'ha', 'MB')
 * @param decimalPlaces - Number of decimals to show (default: 2)
 * @returns A formatted string like "1.23M km²"
 */
export function formatWithPrefix(
    value: number,
    unit: string = 'Ha',
    decimalPlaces: number = 2
): string {
    if(value === null || value === undefined || isNaN(Number(value))) {
        return "0.00";
    }
    const abs = Math.abs(value);
    let scaled = value;
    let prefix = '';

    if (abs >= 1e12) {
        scaled = value / 1e12;
        prefix = 'T';
    } else if (abs >= 1e9) {
        scaled = value / 1e9;
        prefix = 'B';
    } else if (abs >= 1e6) {
        scaled = value / 1e6;
        prefix = 'M';
    } else if (abs >= 1e3) {
        scaled = value / 1e3;
        prefix = 'K';
    }

    const formatted = scaled.toFixed(decimalPlaces);
    return `${formatted}${prefix}${unit ? ` ${unit}` : ''}`;
}
