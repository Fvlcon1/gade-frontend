import Text from "@styles/components/text"
import { useAuthStore } from "@/lib/store/auth-store"
import theme from "@styles/theme"
import Image from "next/image"

const ProfileHead = () => {
    const { user } = useAuthStore()
    return (
        <div
            className={`w-[28px] h-[28px] rounded-full ${user?.profile_url ? "" : "p-2"} flex items-center justify-center bg-bg-quantinary`}
        >
            {
                user?.profile_url ? (
                    <Image
                        src={user?.profile_url}
                        alt="Profile Picture"
                        className="w-full h-full object-cover rounded-full"
                        width={130}
                        height={130}
                    />
                ) : (
                    <Text
                        size={theme.text.size.xs}
                        bold={theme.text.bold.md2}
                        textColor={theme.colors.main.primary}
                    >
                        {`${user?.first_name.charAt(0).toUpperCase()}${user?.last_name.charAt(0).toUpperCase()}`}
                    </Text>
                )
            }
        </div>
    )
}
export default ProfileHead