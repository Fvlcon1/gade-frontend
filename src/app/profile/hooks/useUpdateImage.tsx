import { protectedApi } from "@/utils/apis/api"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import toast from "react-hot-toast"
import { useSettingsContext } from "@/app/context/settings-context"
import useUpdateProfile from "./useUpdateProfile"

const useUpdateImage = () => {
    const {refetchSettings} = useSettingsContext()
    const {updateProfileImageMutation} = useUpdateProfile()
    const getUploadUrl = async () => {
        const response = await protectedApi.GET("settings/upload-url")
        return response
    }

    const {mutateAsync: getUploadUrlMutation, isPending: isGetUploadUrlPending, isSuccess: isGetUploadUrlSuccess} = useMutation({
        mutationFn: getUploadUrl,
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to update image")
            throw error
        }
    })

    const updateImage = async ({presignedUrl, fileUrl, blob}: {presignedUrl: string, fileUrl: string, blob: Blob}) => {
        const response = await axios.put(presignedUrl, blob, {
            headers: {
                "Content-Type": blob.type,
            }
        })
        return response
    }

    const {mutateAsync: updateImageMutation, isPending: isUpdateImagePending, isSuccess: isUpdateImageSuccess} = useMutation({
        mutationFn: updateImage,
        onSuccess: (response, {fileUrl}) => {
            updateProfileImageMutation(fileUrl)
            toast.success("Image updated successfully")
        },
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