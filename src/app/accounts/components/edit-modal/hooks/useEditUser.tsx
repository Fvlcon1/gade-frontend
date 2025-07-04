import { protectedApi } from "@/utils/apis/api"
import { DropdownItem } from "@/utils/@types"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useFormik } from "formik"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import * as Yup from "yup"
import { useAccountsContext } from "../../../context/context"
import { IUserInfo } from "@/app/accounts/utils/types"

const useEditUser = ({
    close,
    user
}: {
    close: () => void,
    user: IUserInfo
}) => {
    const { refetchAccounts } = useAccountsContext()

    const editUserDepartment = async () => {
        const response = await protectedApi.PATCH(`accounts/${user.id}/department`, {
            department: formik.values.department,
        })
        return response
    }

    const editUserRole = async () => {
        const response = await protectedApi.PATCH(`accounts/${user.id}/role`, {
            role: formik.values.role,
        })
        return response
    }

    const editUser = async () => {
        const response = await Promise.all([
            editUserDepartment(),
            editUserRole()
        ])
        return response
    }

    const { mutateAsync: editUserMutation, isPending: isEditPending } = useMutation({
        mutationFn: editUser,
        onSuccess: () => {
            toast.success("User edited successfully")
            refetchAccounts()
            close()
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.detail || "Failed to edit user")
        }
    })

    const validationSchema = Yup.object({
        email: Yup
            .string()
            .email("Invalid email address.")
            .required("Email is required."),
        role: Yup
            .string()
            .required("Role is required."),
    })

    const formik = useFormik({
        initialValues: {
            email: user.email,
            role: user.role,
            department: user.department,
        },
        validationSchema,
        onSubmit: () => {
            editUserMutation()
        }
    })

    return {
        formik,
        isEditPending
    }
}
export default useEditUser