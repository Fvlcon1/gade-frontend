import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Utility to convert snake_case to camelCase
export const toCamelCase = (str: string) =>
    str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

// Recursively convert all object keys to camelCase
export const transformKeysToCamelCase = (obj: any): any => {
    if (Array.isArray(obj)) {
        return obj.map(transformKeysToCamelCase);
    } else if (obj !== null && typeof obj === "object") {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [
                toCamelCase(key),
                transformKeysToCamelCase(value),
            ])
        );
    }
    return obj;
};

/**
 * Capitalizes only the first letter of the input string.
 * @param str - The input string
 * @returns The string with the first letter capitalized
 */
export function capitalizeFirstLetter(str: string): string {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Capitalizes the first letter of each word in the input string.
 * @param str - The input string
 * @returns The string with each word capitalized
 */
export function capitalizeWords(str: string): string {
    if (!str) return "";
    return str
        .split(" ")
        .map(word => capitalizeFirstLetter(word))
        .join(" ");
}