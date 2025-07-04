import { protectedApi } from "@/utils/apis/api"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useAccountsContext } from "../../context/context"

const useDelete = ({
    id,
    close
}: {
    id: string,
    close: () => void
}) => {
    const { refetchAccounts } = useAccountsContext()
    const deleteUser = async () => {
        const response = await protectedApi.DELETE(`accounts/${id}`)
        return response
    }

    const { mutateAsync: deleteUserMutation, isPending: isDeletePending } = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            toast.success("User deleted successfully")
            refetchAccounts()
            close()
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.detail || "Failed to delete user")
        }
    })
    return {
        deleteUserMutation,
        isDeletePending
    }
}
export default useDelete