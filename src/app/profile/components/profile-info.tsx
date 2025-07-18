import Text from "@styles/components/text"
import theme from "@styles/theme"
import { getRelativeTime } from "@/utils/getDate"
import { useAuthStore } from "@/lib/store/auth-store"
import { hexOpacity } from "@/utils/hexOpacity"
import { MdEdit, MdEmail } from "react-icons/md"
import ChangeProfilePicture from "./change-profile-picture/change-profile-picture"
import { useState } from "react"
import Image from "next/image"

const ProfileInfo = () => {
    const { user } = useAuthStore()
    const [isVisible, setIsVisible] = useState(false)

    return (
        <>
            <ChangeProfilePicture
                isVisible={isVisible}
                close={() => setIsVisible(false)}
            />
            <div className="w-full">
                <div className="w-full rounded-xl bg-bg-primary-lighter flex flex-col">
                    <div className="w-full h-[100px] bg-main-primary rounded-t-2xl">

                    </div>
                    <div className="w-full h-full flex px-4 py-2 flex-col gap-2 pb-5 border-[1px] border-border-primary rounded-b-xl">
                        {/* Top Section */}
                        <div className="w-full flex gap-4 mt-[-65px]">
                            <div
                                className="w-[130px] h-[130px] relative rounded-full border-[5px] border-bg-primary flex items-center justify-center"
                                style={{
                                    backgroundColor: "#dcdaec"
                                }}
                            >
                                <div className="absolute bottom-0 right-0 w-[40px] h-[40px] shadow-2xl border-[2px] hover:bg-bg-tetiary cursor-pointer duration-200 border-bg-primary rounded-full bg-bg-secondary flex items-center justify-center"
                                    onClick={() => setIsVisible(true)}
                                >
                                    <MdEdit
                                        color={theme.colors.main.primary}
                                        size={20}
                                    />
                                </div>
                                {
                                    user?.image_url ? (
                                        <Image
                                            src={user?.image_url}
                                            alt="Profile Picture"
                                            className="w-full h-full object-cover rounded-full"
                                            width={130}
                                            height={130}
                                        />
                                    ) : (
                                        <Text
                                            size={"40px"}
                                            bold={theme.text.bold.md2}
                                            textColor={theme.colors.main.primary}
                                        >
                                            {`${user?.first_name.charAt(0).toUpperCase()}${user?.last_name.charAt(0).toUpperCase()}`}
                                        </Text>
                                    )
                                }
                            </div>
                            <div className="flex flex-col mt-2 gap-1">
                                <Text
                                    textColor={"white"}
                                    size={theme.text.size.HM}
                                    bold={theme.text.bold.md}
                                >
                                    {`${user?.first_name} ${user?.last_name}`}
                                </Text>
                                <div className="flex rounded-full bg-white/20 px-2 py-1 w-fit">
                                    <Text
                                        textColor={"#ffffff" + hexOpacity(100)}
                                        bold={theme.text.bold.md}
                                    >
                                        Admin
                                    </Text>
                                </div>

                                <div className="flex items-center mt-4 w-fit gap-1">
                                    {/* <MdEmail size={20} color={theme.colors.text.tetiary} /> */}
                                    <Text textColor={theme.colors.text.tetiary}>
                                        {user?.email}
                                    </Text>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default ProfileInfo