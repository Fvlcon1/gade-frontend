export interface UpdateSettingsPayload {
    appTheme?: string;
    coordinateFormat?: string;
    defaultMapview?: {
        lat: number;
        lon: number;
        zoom: number;
    };
    notificationsEnabled?: boolean;
    units?: string;
}