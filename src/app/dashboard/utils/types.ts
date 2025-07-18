export interface Ranking {
    district: string;
    area: string;
}

export interface TimeSeries {
    period: string;
    value: number;
}

export interface DistrictByArea {
    district: string;
    totalArea: number;
}

export interface SeverityDistribution {
    severity: string;
    siteCount: number;
    totalArea: number;
}

export interface Metrics {
    totalAreaDetected: number;
    totalIllegalSites: number;
    totalReportedCases: number;
    totalForestAreaAffected: number;
}

export interface Metric {
    title: string;
    value: string;
    footer: string;
    icon: any;
}

export interface ReportLocation {
    lat: number;
    lon: number;
}

export interface Report {
    id: string;
    title: string;
    description: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    status: ReportStatus;
    locality: string;
    location: ReportLocation;
    createdAt: string;
    updatedAt: string;
}

export enum ReportStatus {
    OPEN = 'OPEN',
    IN_REVIEW = 'IN_REVIEW',
    RESOLVED = 'RESOLVED',
    CLOSED = 'CLOSED'
}

export interface DashboardContextType {
    // Rankings derived from districtsByArea (formatted for display)
    rankings: Ranking[];
    setRankings: (rankings: Ranking[]) => void;

    // Raw metrics
    areaOverTime: TimeSeries[];
    districtsByArea: DistrictByArea[];
    reportsOverTime: TimeSeries[];
    severityDistribution: SeverityDistribution[];
    totalForestReserveAffected: TimeSeries[];
    metrics: Metrics;
    reports: Report[];

    // Loading state
    isMetricsPending: boolean;
    isReportsPending: boolean;
}