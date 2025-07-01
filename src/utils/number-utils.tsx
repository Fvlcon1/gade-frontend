/**
 * Formats a number with commas and fixed decimals.
 * 
 * @param value - The number to format
 * @param decimals - Number of decimal places (default is 2)
 * @returns Formatted number as string
 */
export function formatNumber(value: number | string, decimals: number = 2): string {
    if (value === null || value === undefined || isNaN(Number(value))) {
        return "0.00";
    }

    const number = parseFloat(value as string);

    return number
        .toFixed(decimals) // fixed decimals
        .replace(/\B(?=(\d{3})+(?!\d))/g, ","); // add commas
}
