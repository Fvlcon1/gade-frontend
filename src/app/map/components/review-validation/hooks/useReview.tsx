import { protectedApi } from "@/utils/apis/api"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import { Status } from "../utils/types"
import { useSpatialStore } from "@/lib/store/spatial-store"
import { statusMapping } from "../utils/constants"

const useReview = () => {
    const {fetchMiningSites, applyFilters} = useSpatialStore()
    const updateStatus = async ({id, status} : {id : string, status : Status}) => {
        const response = await protectedApi.PATCH(`data/mining-sites/${id}/status`, { status: statusMapping[status] })
        return response.data
    }

    const {mutateAsync : updateStatusMutation, isPending : updateStatusPending, isSuccess : updateStatusSuccess, isError : updateStatusError} = useMutation({
        mutationFn: updateStatus,
        onSuccess : async () => {
            toast.success("Status updated successfully")
            await fetchMiningSites()
            applyFilters()
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