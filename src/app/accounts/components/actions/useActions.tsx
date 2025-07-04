
import { protectedApi } from "@/utils/apis/api"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import { useAccountsContext } from "../../context/context"
import { IUserInfo } from "../../utils/types"

const useActions = ({
    user,
}: {
    user: IUserInfo,
}) => {
    const { refetchAccounts } = useAccountsContext()

    const reactivateUser = async () => {
        const response = await protectedApi.PATCH(`accounts/${user.id}/status`, {
            status: "ACTIVE"
        })
        return response
    }

    const { mutateAsync: reactivateUserMutation, isPending: isReactivatePending } = useMutation({
        mutationFn: reactivateUser,
        onSuccess: () => {
            toast.success("Account reactivated successfully")
            refetchAccounts()
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.detail || "Failed to reactivate user")
        }
    })

    const deleteAccount = async () => {
        const response = await protectedApi.DELETE(`accounts/${user.id}`)
        return response
    }

    const { mutateAsync: deleteAccountMutation, isPending: isDeletePending } = useMutation({
        mutationFn: deleteAccount,
        onSuccess: () => {
            toast.success("Account deleted successfully")
            refetchAccounts()
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.detail || "Failed to delete account")
        }
    })

    return {
        reactivateUserMutation,
        isReactivatePending,
        deleteAccountMutation,
        isDeletePending
    }
}
export default useActions