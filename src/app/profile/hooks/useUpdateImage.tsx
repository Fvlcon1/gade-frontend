import { protectedApi } from "@/utils/apis/api"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import toast from "react-hot-toast"

const useUpdateImage = () => {
    const getUploadUrl = async () => {
        const response = await protectedApi.GET("settings/upload-url")
        console.log({response})
        return response
    }

    const {mutateAsync: getUploadUrlMutation, isPending: isGetUploadUrlPending, isSuccess: isGetUploadUrlSuccess} = useMutation({
        mutationFn: getUploadUrl,
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to update image")
            throw error
        }
    })

    const updateImage = async ({presignedUrl, blob}: {presignedUrl: string, blob: Blob}) => {
        const response = await axios.put(presignedUrl, blob, {
            headers: {
                "Content-Type": blob.type,
                "x-amz-acl": "public-read"
            }
        })
        console.log({response})
        return response
    }

    const {mutateAsync: updateImageMutation, isPending: isUpdateImagePending, isSuccess: isUpdateImageSuccess} = useMutation({
        mutationFn: updateImage,
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to update image")
            throw error
        }
    })

    return {
        getUploadUrlMutation,
        isGetUploadUrlPending,
        isGetUploadUrlSuccess,
        updateImageMutation,
        isUpdateImagePending,
        isUpdateImageSuccess
    }
}
export default useUpdateImage