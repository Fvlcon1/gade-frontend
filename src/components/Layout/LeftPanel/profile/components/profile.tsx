import Divider from "@components/ui/divider/divider"
import ProfileInfo from "./profile-info"
import { FaPowerOff, FaUserCircle } from "react-icons/fa"
import Text from "@styles/components/text"
import theme from "@styles/theme"
import { FaGear } from "react-icons/fa6"
import { useState } from "react"
import { ViewStates } from "../profile-view"
import { useAuthStore } from "@/lib/store/auth-store"
import { useRouter } from "next/navigation"
import Link from "next/link"

const Profile = ({
    setViewState
}: {
    setViewState: (viewState: ViewStates) => void
}) => {
        const { logout } = useAuthStore()
        const router = useRouter()

        const routes = [
        {
            label: "Profile",
            href: "/profile",
            icon: <FaUserCircle size={15} color={theme.colors.text.secondary} />
        },
        {
            label: "Preferences",
            icon: <FaGear size={15} color={theme.colors.text.secondary} />,
            onClick: () => setViewState("preferences")
        },
        {
            type: "divider"
        },
        {
            label: "Logout",
            icon: <FaPowerOff size={15} color={"red"} />,
            color: "red",
            onClick: () => {
                router.push('/login')
                logout()
            }
        }
    ]

    return (
        <div className="w-[300px] flex flex-col gap-0">
            <ProfileInfo />
            {/* <Divider /> */}
            <div className="w-full flex flex-col gap-0 px-1 pb-1">
                {
                    routes.map((route, index) => {
                        const component = (
                            <div
                                key={index}
                                className="flex items-center gap-1.5 cursor-pointer hover:bg-bg-secondary rounded-lg px-2 py-1.5 duration-200"
                                onClick={route.onClick}
                            >
                                {route.icon}
                                <Text
                                    textColor={route.color}
                                >
                                    {route.label}
                                </Text>
                            </div>
                        )

                        if (route.type === "divider")
                            return <Divider className="bg-border-primary my-1" key={index} />

                        if(route?.href?.length > 0)
                            return (
                                <Link
                                    href={route.href}
                                    key={index}
                                >
                                    {component}
                                </Link>
                            )

                        return component
                    })
                }
            </div>
        </div>
    )
}
export default Profile