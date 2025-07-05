import { createContext, useContext } from "react";
import useSettings from "../hooks/useSettings";
import { UpdateSettingsPayload } from "../utils/types";
import { Dispatch, SetStateAction } from "react";

const LeftPanelContext = createContext<{
    settings: UpdateSettingsPayload;
    setSettings: Dispatch<SetStateAction<UpdateSettingsPayload>>;
    settingsLoading: boolean;
    settingsError: Error;
    updateSettingsLoading: boolean;
}>({
    settings: null,
    setSettings: () => {},
    settingsLoading: false,
    settingsError: null,
    updateSettingsLoading: false,
})

export const LeftPanelContextProvider = ({ children }: { children: React.ReactNode }) => {
    const settings = useSettings()
    return (
        <LeftPanelContext.Provider value={{ ...settings }}>
            {children}
        </LeftPanelContext.Provider>
    )
}
export const useLeftPanelContext = () => useContext(LeftPanelContext)