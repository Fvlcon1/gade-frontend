import { useEffect, useState } from "react";
import { protectedApi } from "@/utils/apis/api";
import { transformKeysToCamelCase } from "@/utils/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { UpdateSettingsPayload } from "../../components/Layout/LeftPanel/utils/types";
import { useAuthStore } from "@/lib/store/auth-store";
import { setupInterceptors } from "@/utils/apis/axiosInstance";

const isEqual = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);

const useSettings = () => {
    const queryClient = useQueryClient();
    const [localSettings, setLocalSettings] = useState<UpdateSettingsPayload | null>(null);
    const {setUser, user, logout} = useAuthStore()

    const resetPreferences = async () => {
        const response = await protectedApi.POST("/settings/preferences/reset");
        const settings = transformKeysToCamelCase(response.preferences);
        storeSettings(settings);
        queryClient.invalidateQueries({ queryKey: ["settings"] });
    }

    const { mutate: resetPreferencesMutation, isPending: resetPreferencesLoading } = useMutation({
        mutationFn: resetPreferences,
        onSuccess: () => {
            toast.success("Preferences reset successfully");
            queryClient.invalidateQueries({ queryKey: ["settings"] });
            window.location.reload();
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.detail || "Failed to reset preferences");
        },
    });

    setupInterceptors(logout);

    const getSettings = async () => {
        const response = await protectedApi.GET("/settings/profile");
        const settings = transformKeysToCamelCase(response.preferences);
        const profile = transformKeysToCamelCase(response.profile);
        console.log({profile})
        setUser({user, ...response.profile});
        storeSettings(settings);
        return settings;
    };

    const {
        data: settings,
        isLoading: settingsLoading,
        error: settingsError,
        refetch: refetchSettings
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
        onSuccess: (data) => {
            toast.success("Settings updated successfully");
            storeSettings(data);
            queryClient.invalidateQueries({ queryKey: ["settings"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.detail || "Failed to update settings");
        },
    });

    useEffect(() => {
        const storedSettings = localStorage.getItem("settings");
        if (storedSettings) setLocalSettings(JSON.parse(storedSettings));
    }, []);

    const storeSettings = (settings: UpdateSettingsPayload) => {
        setLocalSettings(settings);
        localStorage.setItem("settings", JSON.stringify(settings));
    };

    const saveSettings = (newSettings: UpdateSettingsPayload) => {
        updateSettings(newSettings);
    };

    return {
        settings: localSettings,
        setSettings: setLocalSettings,
        storeSettings,
        saveSettings,
        settingsLoading,
        settingsError,
        updateSettingsLoading,
        resetPreferencesMutation,
        resetPreferencesLoading,
        refetchSettings
    };

};

export default useSettings;
