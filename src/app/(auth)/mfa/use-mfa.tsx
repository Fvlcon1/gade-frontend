'use client'

import { useAuthStore } from "@/lib/store/auth-store"
import { protectedApi } from "@/utils/apis/api"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import Cookies from "universal-cookie"

const cookies = new Cookies();

const useMfa = () => {
    const { pendingLogin, setUser, setPendingLogin } = useAuthStore()
    const router = useRouter()

    const verifyOtp = async (code: string) => {
        const response = protectedApi.POST("auth/verify-otp", {
            email: pendingLogin?.email,
            otp: code
        })
        return response
    }

    const { mutate: verifyOtpMutation, isPending: verifyOtpLoading, error: verifyOtpError } = useMutation({
        mutationFn: verifyOtp,
        onSuccess: (data: any) => {
            cookies.set('access_token', data.access_token);
            cookies.set("refresh_token", data.refresh_token)

            setUser(data.user);
            
            router.push("/dashboard")
            // setPendingLogin(null);
        },
        onError: (error: any) => {
            router.push("/login")
            toast.error(error.response.data.message)
        }
    })

    const resendOtp = async () => {
        const response = protectedApi.POST("auth/send-otp", {
            email: pendingLogin?.email
        })
        return response
    }

    const { mutate: resendOtpMutation, isPending: resendOtpLoading, error: resendOtpError } = useMutation({
        mutationFn: resendOtp,
        onSuccess: () => {
            toast.success("Otp resent successfully")
        },
        onError: (error: any) => {
            toast.error(error.response.data.message)
        }
    })

    return {
        verifyOtpMutation,
        verifyOtpLoading,
        verifyOtpError,
        resendOtpMutation,
        resendOtpLoading,
        resendOtpError
    }
}
export default useMfa