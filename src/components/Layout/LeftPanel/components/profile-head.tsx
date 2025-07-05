import Text from "@styles/components/text"
import { useAuthStore } from "@/lib/store/auth-store"
import theme from "@styles/theme"

const ProfileHead = () => {
    const { user } = useAuthStore()
    return (
        <div
            className="w-[28px] h-[28px] rounded-full p-2 flex items-center justify-center"
            style={{
                backgroundColor: "#dcdaec"
            }}
        >
            <Text
                size={theme.text.size.xs}
                bold={theme.text.bold.md2}
                textColor={theme.colors.main.primary}
            >
                {`${user?.first_name.charAt(0).toUpperCase()}${user?.last_name.charAt(0).toUpperCase()}`}
            </Text>
        </div>
    )
}
export default ProfileHead