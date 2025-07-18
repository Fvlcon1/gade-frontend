'use client'

import { IUserInfo } from "../../utils/types"
import { protectedApi } from "@/utils/apis/api"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { DropdownItem } from "@/utils/@types"
import { toast } from "react-hot-toast"
import { FaEdit, FaUserAltSlash, FaUserCheck } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
import { Tooltip } from "antd"
import ConfirmationModal from "@components/ui/confirmation-modal/confirmation-modal"
import DeactivateConfirmationModal from "../deactivate-confirmation-modal copy/confirmation-modal"
import EditModal from "../edit-modal/edit-modal"
import DeleteConfirmationModal from "../confirmation-modal/confirmation-modal"
import { FaLinkSlash } from "react-icons/fa6"
import useActions from "./useActions"
import { useTheme } from "@styles/theme-context"

const Actions = ({
    user,
    refetchAccounts,
}: {
    user: IUserInfo,
    refetchAccounts: () => void,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isEditVisible, setIsEditVisible] = useState(false);
    const [isDeactivateVisible, setIsDeactivateVisible] = useState(false);
    const [isRevokeVisible, setIsRevokeVisible] = useState(false);
    const [isReactivateVisible, setIsReactivateVisible] = useState(false);
    const { reactivateUserMutation, isReactivatePending, deleteAccountMutation, isDeletePending } = useActions({ user })
    const { theme, themeColor } = useTheme()

    return (
        <>
            <DeleteConfirmationModal isVisible={isVisible} close={() => setIsVisible(false)} user={user} />
            <EditModal isVisible={isEditVisible} close={() => setIsEditVisible(false)} user={user} />
            <DeactivateConfirmationModal isVisible={isDeactivateVisible} close={() => setIsDeactivateVisible(false)} user={user} />
            <ConfirmationModal 
                isVisible={isReactivateVisible} 
                close={() => setIsReactivateVisible(false)} 
                description="Are you sure you want to reactivate this user?"
                onConfirm={reactivateUserMutation}
                cta="Reactivate"
                loading={isReactivatePending}
            />
            <ConfirmationModal
                isVisible={isRevokeVisible}
                close={() => setIsRevokeVisible(false)}
                description="Are you sure you want to revoke this invite?"
                onConfirm={deleteAccountMutation}
                cta="Revoke"
                loading={isDeletePending}
            />

            <div className="flex items-center gap-2">
                <Tooltip
                    title="Edit user"
                >
                    <div
                        className="p-2 rounded-md bg-bg-tetiary hover:bg-bg-quantinary"
                        onClick={() => setIsEditVisible(true)}
                    >
                        <FaEdit color={theme.colors.text.tetiary} />
                    </div>
                </Tooltip>

                {
                    user.status === "INACTIVE" ? (
                        <Tooltip
                            title="Reactivate user"
                        >
                            <div
                                className="p-2 rounded-md bg-green-100 hover:bg-green-200"
                                onClick={() => setIsReactivateVisible(true)}
                            >
                                <FaUserCheck color={"green"} />
                            </div>
                        </Tooltip>
                    ) : null
                }

                {
                    user.status !== "PENDING" ? (
                        <>
                            {
                                user.status === "ACTIVE" ? (
                                    <Tooltip
                                        title="Deactivate user"
                                    >
                                        <div
                                            className="p-2 rounded-md bg-orange-100 hover:bg-orange-200"
                                            onClick={() => setIsDeactivateVisible(true)}
                                        >
                                            <FaUserAltSlash color={"orange"} />
                                        </div>
                                    </Tooltip>
                                ) : null
                            }
                            <Tooltip
                                title="Delete user"
                            >
                                <div
                                    className="p-2 rounded-md bg-red-100 hover:bg-red-200"
                                    onClick={() => setIsVisible(true)}
                                >
                                    <MdDelete
                                        color={"#eb4646"}
                                    />
                                </div>
                            </Tooltip>
                        </>
                    ) : (
                        <Tooltip
                            title="Revoke invite"
                        >
                            <div
                                className="p-2 rounded-md bg-bg-tetiary hover:bg-bg-quantinary"
                                onClick={() => setIsRevokeVisible(true)}
                            >
                                <FaLinkSlash
                                    color={themeColor === "dark" ? "#b04fb0" : "purple"}
                                />
                            </div>
                        </Tooltip>
                    )
                }
            </div>
        </>
    )
}

export default Actions