import { protectedApi } from "@/utils/apis/api"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useAccountsContext } from "../../context/context"

const useDeactivate = ({
    id,
    close
}: {
    id: string,
    close: () => void
}) => {
    const { refetchAccounts } = useAccountsContext()
    const deactivateUser = async () => {
        const response = await protectedApi.PATCH(`accounts/${id}/status`, {
            status: "INACTIVE"
        })
        return response
    }

    const { mutateAsync: deactivateUserMutation, isPending: isDeactivatePending } = useMutation({
        mutationFn: deactivateUser,
        onSuccess: () => {
            toast.success("User deactivated successfully")
            refetchAccounts()
            close()
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.detail || "Failed to deactivate user")
        }
    })
    return {
        deactivateUserMutation,
        isDeactivatePending
    }
}
export default useDeactivate