import { useAuthStore } from "@/lib/store/auth-store";
import { useFormik } from "formik";
import * as yup from "yup"
import { protectedApi } from "@/utils/apis/api";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useUpdateProfile = () => {
    const { user, setUser } = useAuthStore();

    const formik = useFormik({
        initialValues: {
            firstname: user?.first_name,
            lastname: user?.last_name,
            username: user?.user_name,
        },
        validationSchema: yup.object({
            firstname: yup.string().required("First Name is required"),
            lastname: yup.string().required("Last Name is required"),
            username: yup.string().required("Username is required"),
        }),
        onSubmit: (values) => {
            updateProfileMutation()
        }
    })

    const updateProfile = async () => {
        const response = await protectedApi.PUT("settings/profile", {
            first_name: formik.values.firstname,
            profile_url : "",
            last_name: formik.values.lastname,
            user_name: formik.values.username,
        })
        return response
    }

    const { mutateAsync: updateProfileMutation, isPending: isUpdateProfilePending, isSuccess: isUpdateProfileSuccess } = useMutation({
        mutationFn: updateProfile,
        onSuccess: (response) => {
            setUser({
                ...user,
                ...response.profile
            })
            toast.success("Profile updated successfully")
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to update profile")
        }
    })

    return {
        formik,
        isUpdateProfilePending,
        isUpdateProfileSuccess
    }
}
export default useUpdateProfile