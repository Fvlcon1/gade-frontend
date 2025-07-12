import Button from "@components/ui/button/button"
import OutlineButton from "@components/ui/button/outlineButton"
import { useProfileContext } from "../context/profile-context"
import { useAuthStore } from "@/lib/store/auth-store"
import { useState } from "react"
import DeleteConfirmationModal from "./delete-confirmation-modal/confirmation-modal"

const Actions = ({
    showPasswordModal,
    setShowPasswordModal
} : {
    showPasswordModal : boolean
    setShowPasswordModal : (value : boolean) => void
}) => {
    const { isUpdateProfilePending, formik } = useProfileContext()
    const { user } = useAuthStore()
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
    const isUpdatable = formik.values.firstname !== user?.first_name || formik.values.lastname !== user?.last_name || formik.values.username !== user?.user_name
    
    return (
        <>
            <DeleteConfirmationModal
                isVisible={isDeleteModalVisible}
                close={() => setIsDeleteModalVisible(false)}
                user={user as any}
            />

            <div className="w-full justify-between flex mt-8">
                <div className="flex items-center gap-2">
                    <Button 
                        text="Delete Account"
                        background="#bc3d44"
                        color="#ffffff"
                        onClick={() => setIsDeleteModalVisible(true)}
                    />
                    <OutlineButton 
                        text="Change Password"
                        onClick={() => setShowPasswordModal(true)}
                    />
                </div>

                <Button 
                    text="Save Changes"
                    loading={isUpdateProfilePending}
                    disabled={!isUpdatable}
                    onClick={formik.handleSubmit}
                />
            </div>
        </>
    )
}
export default Actions