'use client'
import { useState, Dispatch, SetStateAction } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTheme } from "@styles/theme-context";
import * as yup from "yup"
import { useFormik } from "formik"
import { protectedApi } from "@/utils/apis/api";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const usePassword = () => {
    const { theme } = useTheme();
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validationSchema = yup.object({
        currentPassword: yup.string().required("Current Password is required"),
        newPassword: yup.string().required("New Password is required"),
        confirmPassword: yup.string().oneOf([yup.ref("newPassword"), null], "Passwords must match").required("Confirm Password is required"),
    })

    const updatePassword = async () => {
        const response = await protectedApi.PUT("settings/password", {
            current_password: formik.values.currentPassword,
            new_password: formik.values.newPassword,
        })
        return response
    }

    const { mutateAsync: updatePasswordMutation, isPending: isUpdatePasswordPending, isSuccess: isUpdatePasswordSuccess } = useMutation({
        mutationFn: updatePassword,
        onSuccess: () => {
            toast.success("Password updated successfully")
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to update password")
        }
    })

    const formik = useFormik({
        initialValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        },
        validationSchema,
        onSubmit: () => {
            updatePasswordMutation()
        }
    })

    const hasMinLength = formik.values.newPassword.length >= 8;
    const hasUppercase = /[A-Z]/.test(formik.values.newPassword);
    const hasLowercase = /[a-z]/.test(formik.values.newPassword);
    const hasNumber = /[0-9]/.test(formik.values.newPassword);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(formik.values.newPassword);
  
    const passwordCriteria = [
      { text: 'At least 8 characters', met: hasMinLength },
      { text: 'At least one uppercase letter', met: hasUppercase },
      { text: 'At least one lowercase letter', met: hasLowercase },
      { text: 'At least one number', met: hasNumber },
      { text: 'At least one special character eg. #,{,},&,%,$,!,(,),*,/,?,@, etc..', met: hasSpecialChar },
    ];

    return {
        showCurrentPassword,
        showNewPassword,
        showConfirmPassword,
        setShowCurrentPassword,
        setShowNewPassword,
        setShowConfirmPassword,
        formik,
        passwordCriteria,
        isUpdatePasswordPending,
        isUpdatePasswordSuccess,
    }
}
export default usePassword