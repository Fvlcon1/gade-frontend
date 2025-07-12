'use client'

import { createContext, useContext } from "react"
import { ReactNode } from "react"
import useUpdateProfile from "../hooks/useUpdateProfile"

const ProfileContext = createContext<{
    formik: any
    isUpdateProfilePending: boolean
    isUpdateProfileSuccess: boolean
}>({
    formik: null,
    isUpdateProfilePending: false,
    isUpdateProfileSuccess: false
})

const ProfileProvider = ({ children }: { children: ReactNode }) => {
    const { formik, isUpdateProfilePending, isUpdateProfileSuccess } = useUpdateProfile()
    return (
        <ProfileContext.Provider value={{
            formik,
            isUpdateProfilePending,
            isUpdateProfileSuccess
        }}>
            {children}
        </ProfileContext.Provider>
    )
}

export const useProfileContext = () => useContext(ProfileContext)

export default ProfileProvider
