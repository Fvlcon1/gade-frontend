'use client'

import Header from "@components/header/header";
import LeftPanel from "@components/Layout/LeftPanel/LeftPanel"
import ProfileInfo from "./components/profile-info";
import Fields from "./components/fields";
import { useAuthStore } from "@/lib/store/auth-store";

const Profile = () => {
    const { sidebarExpanded } = useAuthStore();
    return (
        <div className="w-full h-full flex">
            <div className="absolute top-0 left-1.5 z-[1001] h-full py-4">
                <LeftPanel />
            </div>

            <div className={`flex gap-4 pr-4 w-full duration-400 h-full pt-5 ${sidebarExpanded ? 'pl-[272px]' : 'pl-[72px]'}`}>
                <div className="flex w-full flex-col items-center">
                    <div className="w-[1024px] flex flex-col gap-4">
                        <ProfileInfo />
                        <Fields />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Profile