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
    if (value === null || value === undefined || isNaN(Number(value))) {
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

type UnitSystem = "metric" | "imperial";
type MeasurementType = "length" | "area" | "volume";

type Unit =
    | "m" | "km" | "ft" | "mi"          // length
    | "m²" | "ha" | "ac"                // area
    | "m³" | "l" | "gal";               // volume

interface FormatUnitOptions {
    value: number | null | undefined;
    system?: UnitSystem;          // default: "metric"
    type?: MeasurementType;       // default: "length"
    unit?: Unit;                  // default: system/type default
    decimalPlaces?: number;       // default: 2
}

const unitMaps = {
    length: {
        metric: { m: { label: "m", factor: 1 }, km: { label: "km", factor: 1 / 1000 } },
        imperial: { ft: { label: "ft", factor: 3.28084 }, mi: { label: "mi", factor: 0.000621371 } }
    },
    area: {
        metric: { "m²": { label: "m²", factor: 1 }, ha: { label: "ha", factor: 1 / 10000 } },
        imperial: { ac: { label: "ac", factor: 0.000247105 } }
    },
    volume: {
        metric: { "m³": { label: "m³", factor: 1 }, l: { label: "l", factor: 1000 } },
        imperial: { gal: { label: "gal", factor: 264.172 } }
    }
};

const defaultUnits: Record<MeasurementType, Record<UnitSystem, Unit>> = {
    length: { metric: "m", imperial: "ft" },
    area: { metric: "m²", imperial: "ac" },
    volume: { metric: "m³", imperial: "gal" }
};

export function formatWithUnit({
    value,
    system = "metric",
    type = "length",
    unit,
    decimalPlaces = 2
}: FormatUnitOptions): string {
    if (value === null || value === undefined || isNaN(Number(value))) {
        return `0.00 ${unit || defaultUnits[type][system]}`;
    }

    const unitsForType = unitMaps[type][system];
    const chosenUnit = unit || defaultUnits[type][system];
    const unitInfo = unitsForType[chosenUnit as keyof typeof unitsForType];

    if (!unitInfo) {
        // fallback: show as-is with given unit
        return `${value.toFixed(decimalPlaces)} ${chosenUnit}`;
    }

    if (unitInfo && typeof unitInfo === 'object' && 'factor' in unitInfo && 'label' in unitInfo) {
        const displayValue = value * (unitInfo as { factor: number; label: string }).factor;
        return `${displayValue.toFixed(decimalPlaces)} ${(unitInfo as { label: string }).label}`;
    }
    // fallback: show as-is with given unit
    return `${value.toFixed(decimalPlaces)} ${chosenUnit}`;
}
