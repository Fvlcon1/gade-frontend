import OutlineButton from "@components/ui/button/outlineButton"
import { useSettingsContext } from "@/app/context/settings-context"
import { FaUserGear } from "react-icons/fa6"
import { useConfirmationModal } from "@components/ui/modals/confirmation-modal/confirmation-modal-context"
import { useTheme } from "@styles/theme-context"

const Actions = () => {
    const { resetPreferencesMutation, resetPreferencesLoading } = useSettingsContext()
    const showConfirmation = useConfirmationModal()
    const { theme } = useTheme()

    const handleResetPreferences = () => {
        showConfirmation({
            title: "Reset Preferences",
            description: "Are you sure you want to reset your preferences?",
            cta: "Reset",
            loading: resetPreferencesLoading,
            icon: <FaUserGear />,
            color: theme.colors.main.primary,
            onConfirm: () => resetPreferencesMutation()
        })
    }

    return (
        <>
            <OutlineButton
                text="Reset Preferences"
                onClick={handleResetPreferences}
                loading={resetPreferencesLoading}
            />
        </>
    )
}
export default Actions