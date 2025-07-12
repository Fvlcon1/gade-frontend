'use client'

import { createContext, useContext } from "react";
import useSettings from "../hooks/useSettings";
import { UpdateSettingsPayload } from "../../components/Layout/LeftPanel/utils/types";
import { Dispatch, SetStateAction } from "react";

const SettingsContext = createContext<{
    settings: UpdateSettingsPayload;
    setSettings: Dispatch<SetStateAction<UpdateSettingsPayload>>;
    saveSettings: (newSettings: UpdateSettingsPayload) => void;
    storeSettings: (settings: UpdateSettingsPayload) => void;
    settingsLoading: boolean;
    settingsError: Error;
    updateSettingsLoading: boolean;
    resetPreferencesMutation: () => void;
    resetPreferencesLoading: boolean;
}>({
    settings: null,
    setSettings: () => {},
    saveSettings: () => {},
    storeSettings: () => {},
    settingsLoading: false,
    settingsError: null,
    updateSettingsLoading: false,
    resetPreferencesMutation: () => {},
    resetPreferencesLoading: false,
})

export const SettingsContextProvider = ({ children }: { children: React.ReactNode }) => {
    const settings = useSettings()
    return (
        <SettingsContext.Provider value={{ ...settings }}>
            {children}
        </SettingsContext.Provider>
    )
}
export const useSettingsContext = () => useContext(SettingsContext)