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
type Unit = "m" | "km" | "ft" | "mi" | "m²" | "ha" | "km²" | "ac" | "m³" | "l" | "gal";

interface FormatUnitOptions {
    value: number | null | undefined;
    system?: UnitSystem;
    type?: MeasurementType;
    unit?: Unit;
    decimalPlaces?: number;
    useMetricPrefixes?: boolean;
    prefixStyle?: "value" | "unit";
}

type UnitInfo = {
    label: string;
    factor: number;
    baseUnit?: string;
    threshold?: number; // Minimum value to prefer this unit
};

const unitMaps: Record<MeasurementType, Record<UnitSystem, Record<string, UnitInfo>>> = {
    length: {
        metric: {
            m: { label: "m", factor: 1, baseUnit: "m", threshold: 0 },
            km: { label: "km", factor: 1 / 1000, baseUnit: "m", threshold: 1000 },
        },
        imperial: {
            ft: { label: "ft", factor: 3.28084, threshold: 0 },
            mi: { label: "mi", factor: 0.000621371, threshold: 5280 }, // 5280 ft = 1 mile
        },
    },
    area: {
        metric: {
            "m²": { label: "m²", factor: 1, baseUnit: "m²", threshold: 0 },
            ha: { label: "ha", factor: 1 / 10000, baseUnit: "m²", threshold: 5000 }, // Use ha for areas > 5000m²
            "km²": { label: "km²", factor: 1 / 1000000, baseUnit: "m²", threshold: 500000 }, // Use km² for areas > 50ha
        },
        imperial: {
            "ft²": { label: "ft²", factor: 10.764, threshold: 0 },
            ac: { label: "ac", factor: 0.000247105, threshold: 10000 }, // ~10,000 ft²
        },
    },
    volume: {
        metric: {
            "m³": { label: "m³", factor: 1, baseUnit: "m³", threshold: 0 },
            l: { label: "l", factor: 1000, baseUnit: "m³", threshold: 0.001 }, // Use L for small volumes
        },
        imperial: {
            "ft³": { label: "ft³", factor: 35.314, threshold: 0 },
            gal: { label: "gal", factor: 264.172, threshold: 0.1 },
        },
    },
};

// Real-world usage thresholds for areas
const areaThresholds = {
    metric: [
        { unit: "m²", max: 5000, description: "Small areas: rooms, small plots" },
        { unit: "ha", max: 500000, description: "Medium-large areas: farms, parks" }, // 50 hectares
        { unit: "km²", max: Infinity, description: "Very large areas: cities, regions" },
    ],
    imperial: [
        { unit: "ft²", max: 43560, description: "Small areas" }, // 1 acre = 43,560 ft²
        { unit: "ac", max: Infinity, description: "Large areas" },
    ]
};

function findBestAreaUnit(unitsForType: Record<string, UnitInfo>, value: number, system: UnitSystem): { unit: string; info: UnitInfo } {
    const thresholds = areaThresholds[system];
    
    for (const threshold of thresholds) {
        if (value <= threshold.max && unitsForType[threshold.unit]) {
            return { 
                unit: threshold.unit, 
                info: unitsForType[threshold.unit] 
            };
        }
    }
    
    // Fallback to largest unit
    const fallbackUnit = system === "metric" ? "km²" : "ac";
    return { 
        unit: fallbackUnit, 
        info: unitsForType[fallbackUnit] 
    };
}

function findBestUnit(
    unitsForType: Record<string, UnitInfo>, 
    value: number, 
    type: MeasurementType,
    system: UnitSystem
): { unit: string; info: UnitInfo } {
    
    // Special handling for areas using real-world thresholds
    if (type === "area") {
        return findBestAreaUnit(unitsForType, value, system);
    }
    
    // For length and volume, use threshold-based selection
    const candidates = Object.entries(unitsForType)
        .map(([unit, info]) => ({ unit, info }))
        .sort((a, b) => (b.info.threshold || 0) - (a.info.threshold || 0)); // Highest threshold first

    // Find the appropriate unit based on threshold
    for (const candidate of candidates) {
        const threshold = candidate.info.threshold || 0;
        if (value >= threshold) {
            return { unit: candidate.unit, info: candidate.info };
        }
    }

    // Fallback to smallest unit
    return { 
        unit: candidates[candidates.length - 1].unit, 
        info: candidates[candidates.length - 1].info 
    };
}

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
        const fallbackUnit = unit || "m";
        return `0.${"0".repeat(decimalPlaces)} ${fallbackUnit}`;
    }

    // Determine system
    let resolvedSystem = system || "metric";

    const unitsForType = unitMaps[type]?.[resolvedSystem];
    if (!unitsForType) {
        return `${value.toFixed(decimalPlaces)} unknown`;
    }

    // Determine unit to use
    let chosenUnit: string;
    let unitInfo: UnitInfo;

    if (unit && unitsForType[unit]) {
        chosenUnit = unit;
        unitInfo = unitsForType[unit];
    } else {
        const best = findBestUnit(unitsForType, value, type, resolvedSystem);
        chosenUnit = best.unit;
        unitInfo = best.info;
    }

    let scaledValue = value * unitInfo.factor;
    return `${scaledValue.toFixed(decimalPlaces)} ${unitInfo.label}`;
}