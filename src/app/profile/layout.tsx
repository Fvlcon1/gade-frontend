'use client'

import ProfileProvider from "./context/profile-context"

const ProfileLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <ProfileProvider>
            {children}
        </ProfileProvider>
    )
}
export default ProfileLayout