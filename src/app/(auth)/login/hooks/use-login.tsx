'use client'
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { useFormik } from "formik"
import * as yup from "yup"
import { useAuthStore } from "@/lib/store/auth-store"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

const useLogin = () => {
    const router = useRouter()
    const {setPendingLogin} = useAuthStore()
    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: yup.object({
            email: yup.string().email("Invalid email").required("Email is required"),
            password: yup.string().required("Password is required"),
        }),
        onSubmit: () => {
            loginMutation()
        }
    })

    const login = async () => {
        const response = axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            ...formik.values,
            redirectUrl: "/"
        })
        return response
    }

    const {mutate: loginMutation, isPending: loginLoading, error: loginError} = useMutation({
        mutationFn: login,
        onSuccess: (_, variables) => {
            setPendingLogin(formik.values)
            router.push("/mfa")
        },
        onError: (error : any) => {
            toast.error(error.response.data.message)
        }
    })

    return {
        formik,
        loginMutation,
        loginLoading,
        loginError
    }
}
export default useLogin