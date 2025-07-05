import { useEffect, useState } from "react";
import { protectedApi } from "@/utils/apis/api";
import { transformKeysToCamelCase } from "@/utils/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { UpdateSettingsPayload } from "../utils/types";

const isEqual = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);

const useSettings = () => {
    const queryClient = useQueryClient();
    const [localSettings, setLocalSettings] = useState<UpdateSettingsPayload | null>(null);

    const getSettings = async () => {
        const response = await protectedApi.GET("/settings/profile");
        return transformKeysToCamelCase(response.preferences);
    };

    const {
        data: settings,
        isLoading: settingsLoading,
        error: settingsError,
    } = useQuery({
        queryKey: ["settings"],
        queryFn: getSettings,
        refetchOnMount: true,
    });

    const { mutate: updateSettings, isPending: updateSettingsLoading } = useMutation({
        mutationFn: async (payload: UpdateSettingsPayload) => {
            const response = await protectedApi.PUT("/settings/preferences", {
                app_theme: payload.appTheme,
                coordinate_format: payload.coordinateFormat,
                default_mapview: payload.defaultMapview,
                notifications_enabled: payload.notificationsEnabled,
                units: payload.units,
            });
            return transformKeysToCamelCase(response.preferences);
        },
        onSuccess: () => {
            toast.success("Settings updated successfully");
            queryClient.invalidateQueries({ queryKey: ["settings"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.detail || "Failed to update settings");
        },
    });

    useEffect(() => {
        if (settings) {
            setLocalSettings({
                appTheme: settings.appTheme,
                coordinateFormat: settings.coordinateFormat,
                defaultMapview: settings.defaultMapview,
                notificationsEnabled: settings.notificationsEnabled,
                units: settings.units,
            });
        }
    }, [settings]);

    useEffect(() => {
        console.log({localSettings})
        if (!settings || !localSettings) return;

        const currentSettings = {
            appTheme: settings.appTheme,
            coordinateFormat: settings.coordinateFormat,
            defaultMapview: settings.defaultMapview,
            notificationsEnabled: settings.notificationsEnabled,
            units: settings.units,
        };

        if (!isEqual(currentSettings, localSettings)) {
            updateSettings(localSettings);
        }
    }, [localSettings]);

    return {
        settings: localSettings,
        setSettings: setLocalSettings,
        settingsLoading,
        settingsError,
        updateSettingsLoading,
    };
};

export default useSettings;
