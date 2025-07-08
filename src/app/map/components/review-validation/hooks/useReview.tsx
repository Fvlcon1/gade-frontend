import { protectedApi } from "@/utils/apis/api"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import { Status } from "../utils/types"

const statusMapping: Record<Status, string> = {
    "Open": "OPEN",
    "In Review": "IN_REVIEW",
    "False Positive": "FALSE_POSITIVE",
    "Closed": "CLOSED"
}

const useReview = () => {
    const updateStatus = async ({id, status} : {id : string, status : Status}) => {
        const response = await protectedApi.PATCH(`data/mining-sites/${id}/status`, { status: statusMapping[status] })
        return response.data
    }

    const {mutateAsync : updateStatusMutation, isPending : updateStatusPending, isSuccess : updateStatusSuccess, isError : updateStatusError} = useMutation({
        mutationFn: updateStatus,
        onSuccess : () => {
            toast.success("Status updated successfully")
        },
        onError : (error : any) => {
            toast.error(error?.response?.data?.detail || "Failed to update status")
        }
    })

    return {
        updateStatusMutation,
        updateStatusPending,
        updateStatusSuccess,
        updateStatusError
    }
}
export default useReview