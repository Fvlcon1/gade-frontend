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
    | "m" | "km" | "ft" | "mi"
    | "m²" | "ha" | "ac"
    | "m³" | "l" | "gal";

interface FormatUnitOptions {
    value: number | null | undefined;
    system?: UnitSystem;                // default: localStorage or "metric"
    type?: MeasurementType;             // default: "length"
    unit?: Unit;                        // default: system/type default
    decimalPlaces?: number;            // default: 2
    useMetricPrefixes?: boolean;       // enable metric prefix scaling
    prefixStyle?: "value" | "unit";    // "value" = 5.6M km², "unit" = 5.6 Mm²
}

type UnitInfo = {
    label: string;
    factor: number;
};

const unitMaps: Record<MeasurementType, Record<UnitSystem, Record<string, UnitInfo>>> = {
    length: {
        metric: {
            m: { label: "m", factor: 1 },
            km: { label: "km", factor: 1 / 1000 },
        },
        imperial: {
            ft: { label: "ft", factor: 3.28084 },
            mi: { label: "mi", factor: 0.000621371 },
        },
    },
    area: {
        metric: {
            "m²": { label: "m²", factor: 1 },
            ha: { label: "ha", factor: 1 / 10000 },
        },
        imperial: {
            ac: { label: "ac", factor: 0.000247105 },
        },
    },
    volume: {
        metric: {
            "m³": { label: "m³", factor: 1 },
            l: { label: "l", factor: 1000 },
        },
        imperial: {
            gal: { label: "gal", factor: 264.172 },
        },
    },
};

const defaultUnits: Record<MeasurementType, Record<UnitSystem, Unit>> = {
    length: { metric: "m", imperial: "ft" },
    area: { metric: "m²", imperial: "ac" },
    volume: { metric: "m³", imperial: "gal" },
};

const metricPrefixes = [
    { prefix: "T", factor: 1e12 },
    { prefix: "B", factor: 1e9 },
    { prefix: "M", factor: 1e6 },
    { prefix: "K", factor: 1e3 },
];

const metricUnitPrefixes = [
    { prefix: "T", factor: 1e12 },
    { prefix: "G", factor: 1e9 },
    { prefix: "M", factor: 1e6 },
    { prefix: "k", factor: 1e3 },
    { prefix: "h", factor: 1e2 },
    { prefix: "da", factor: 1e1 },
];

const imperialAutoConvert = (
    unitsForType: Record<Unit, UnitInfo>,
    rawValue: number
): { value: number; label: string } => {
    const candidates = Object.entries(unitsForType)
        .map(([unit, info]) => ({
            unit,
            factor: info.factor,
            label: info.label,
        }))
        .sort((a, b) => b.factor - a.factor);

    for (const c of candidates) {
        const converted = rawValue * c.factor;
        if (converted >= 1) {
            return { value: converted, label: c.label };
        }
    }

    const last = candidates[candidates.length - 1];
    return { value: rawValue * last.factor, label: last.label };
};

export function formatWithUnit({
    value,
    system,
    type = "length",
    unit,
    decimalPlaces = 0,
    useMetricPrefixes = true,
    prefixStyle = "value",
}: FormatUnitOptions): string {
    if (!Number.isFinite(value)) {
        const fallbackSystem = system || "metric";
        const fallbackUnit = unit || defaultUnits[type][fallbackSystem];
        return `0.00 ${fallbackUnit}`;
    }

    // Determine system if not provided
    let resolvedSystem = system;
    if (!resolvedSystem) {
        if (typeof window !== "undefined") {
            const settings = localStorage.getItem("settings");
            resolvedSystem = JSON.parse(settings || "{}")?.units || "metric";
        } else {
            resolvedSystem = "metric";
        }
    }

    const unitsForType = unitMaps[type][resolvedSystem];

    let chosenUnit = unit;
    if (!chosenUnit) {
        const candidates = Object.entries(unitsForType)
            .map(([unitKey, info]) => ({
                unit: unitKey as Unit,
                factor: info.factor,
            }))
            .sort((a, b) => b.factor - a.factor);

        chosenUnit =
            candidates.find((c) => value * c.factor >= 1)?.unit ||
            candidates[candidates.length - 1].unit;
    }

    const unitInfo = unitsForType[chosenUnit];
    if (!unitInfo) {
        return `${value.toFixed(decimalPlaces)} ${chosenUnit}`;
    }

    let scaledValue = value * unitInfo.factor;

    // IMPERIAL: auto convert to best unit
    if (resolvedSystem === "imperial" && !unit) {
        const { value: converted, label } = imperialAutoConvert(unitsForType, value);
        return `${converted.toLocaleString(undefined, {
            maximumFractionDigits: decimalPlaces,
        })} ${label}`;
    }

    // METRIC: apply prefixes based on chosen style
    const baseUnits = ["m", "m²", "m³"];
    if (useMetricPrefixes && resolvedSystem === "metric" && baseUnits.includes(unitInfo.label)) {
        if (prefixStyle === "value") {
            // COMMON STYLE: Prefix on value (5.6M m²)
            for (const p of metricPrefixes) {
                if (Math.abs(scaledValue) >= p.factor) {
                    scaledValue = scaledValue / p.factor;
                    return `${scaledValue.toFixed(decimalPlaces)}${p.prefix} ${unitInfo.label}`;
                }
            }
        } else if (prefixStyle === "unit") {
            // SCIENTIFIC STYLE: Prefix on unit (5.6 Mm²)
            for (const p of metricUnitPrefixes) {
                if (scaledValue / p.factor >= 1) {
                    const newValue = scaledValue / p.factor;
                    return `${newValue.toFixed(decimalPlaces)} ${p.prefix}${unitInfo.label}`;
                }
            }
        }
    }

    return `${scaledValue.toFixed(decimalPlaces)} ${unitInfo.label}`;
}
