'use client'

import Header from "@components/header/header";
import LeftPanel from "@components/Layout/LeftPanel/LeftPanel"
import ProfileInfo from "./components/profile-info";
import Fields from "./components/fields";
import { useAuthStore } from "@/lib/store/auth-store";
import Actions from "./components/actions";
import { useState } from "react";
import ChangePassword from "./components/change-password";

const Profile = () => {
    const { sidebarExpanded } = useAuthStore();
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    return (
        <>
            <ChangePassword
                isVisible={showPasswordModal}
                close={() => setShowPasswordModal(false)}
            />
            
            <div className="w-full h-full flex">
                <div className="absolute top-0 left-1.5 z-[1001] h-full py-4">
                    <LeftPanel />
                </div>

                <div className={`flex gap-4 pr-4 w-full duration-400 h-full pt-6 ${sidebarExpanded ? 'pl-[272px]' : 'pl-[72px]'}`}>
                    <div className="flex w-full flex-col items-center">
                        <div className="w-[800px] flex flex-col gap-4">
                            <ProfileInfo />
                            <Fields />
                            <Actions
                                showPasswordModal={showPasswordModal}
                                setShowPasswordModal={setShowPasswordModal}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Profile