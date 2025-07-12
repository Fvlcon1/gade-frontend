import Text from "@styles/components/text"
import theme from "@styles/theme"
import { getRelativeTime } from "@/utils/getDate"
import { useAuthStore } from "@/lib/store/auth-store"
import { hexOpacity } from "@/utils/hexOpacity"

const ProfileInfo = () => {
    const {user} = useAuthStore()
    
    return (
        <div className="w-full p-2">
            <div className="w-full rounded-xl bg-bg-primary-lighter flex flex-col">
                <div className="w-full h-[80px] bg-main-primary rounded-t-2xl">

                </div>
                <div className="w-full h-full flex shadow-lg shadow-black/5 px-4 py-2 flex-col gap-2 border-[1px] border-border-primary rounded-b-xl">
                    {/* Top Section */}
                    <div className="w-full flex gap-4 mt-[-65px]">
                        <div
                            className="w-[80px] h-[80px] rounded-full border-[5px] border-bg-primary flex items-center justify-center"
                            style={{
                                backgroundColor: "#dcdaec"
                            }}
                        >
                            <Text
                                size={theme.text.size.HL}
                                bold={theme.text.bold.md2}
                                textColor={theme.colors.main.primary}
                            >
                                {`${user?.first_name.charAt(0).toUpperCase()}${user?.last_name.charAt(0).toUpperCase()}`}
                            </Text>
                        </div>
                        <div className="flex flex-col mt-3 gap-1">
                            <Text
                                textColor={"#ffffff"}
                                size={theme.text.size.body2}
                                bold={theme.text.bold.md}
                            >
                                {`${user?.first_name} ${user?.last_name}`}
                            </Text>
                            <Text
                                textColor={"#ffffff" + hexOpacity(70)}
                            >
                                Admin
                            </Text>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="flex flex-col">
                        <Text>
                            <Text
                                textColor={theme.colors.text.tetiary}
                            >
                                Email:&nbsp;
                            </Text>
                            {user?.email}
                        </Text>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ProfileInfo