'use client'

import { useState } from "react"
import { useFormik } from "formik"
import * as yup from "yup"
import { protectedApi } from "@/utils/apis/api"
import { useSearchParams } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

const useRegister = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const formik = useFormik({
        initialValues: {
            firstname: "",
            lastname: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: ""
        },
        validationSchema: yup.object({
            firstname: yup.string().required("First Name is required"),
            lastname: yup.string().required("Last Name is required"),
            username: yup.string().required("Username is required"),
            password: yup.string().matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>\-])[A-Za-z\d!@#$%^&*(),.?":{}|<>\-]{8,}$/,
                "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character"
              ).required("Password is required"),
            confirmPassword: yup.string().oneOf([yup.ref("password"), null], "Passwords must match").required("Confirm Password is required"),
        }),
        onSubmit: () => {
            registerMutation()
        }
    })

    const hasMinLength = formik.values.password.length >= 8;
    const hasUppercase = /[A-Z]/.test(formik.values.password);
    const hasLowercase = /[a-z]/.test(formik.values.password);
    const hasNumber = /[0-9]/.test(formik.values.password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>\-]/.test(formik.values.password);
    
    const passwordCriteria = [
        { text: 'At least 8 characters', met: hasMinLength },
        { text: 'At least one uppercase letter', met: hasUppercase },
        { text: 'At least one lowercase letter', met: hasLowercase },
        { text: 'At least one number', met: hasNumber },
        { text: 'At least one special character eg. #,{,},&,%,$,!,(,),*,/,?,@, etc..', met: hasSpecialChar },
    ];

    const register = async () => {
        const response = await protectedApi.POST("accounts/setup", {
            first_name: formik.values.firstname,
            last_name: formik.values.lastname,
            user_name: formik.values.username,
            password: formik.values.password,
            token
        })
        return response
    }

    const {mutate: registerMutation, isPending: registerLoading, error: registerError} = useMutation({
        mutationFn: register,
        onSuccess: () => {
            toast.success("Account created successfully")
            router.push("/login")
        },
        onError: (error : any) => {
            toast.error(error.response.data.message)
        }
    })

    return {
        formik,
        passwordCriteria,
        registerLoading,
        registerError
    }
}
export default useRegister