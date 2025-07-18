import { protectedApi } from "@/utils/apis/api"
import { DropdownItem } from "@/utils/@types"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useFormik } from "formik"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import * as Yup from "yup"
import { useAccountsContext } from "../../../context/context"

const useInvite = ({
    close
}: {
    close: () => void
}) => {
    const { refetchAccounts } = useAccountsContext()

    const sendInvite = async () => {
        const response = await protectedApi.POST("accounts/register", {
            email: formik.values.email,
            role: formik.values.role,
            department: formik.values.department
        })
        return response
    }

    const { mutateAsync: sendInviteMutation, isPending: isInvitePending } = useMutation({
        mutationFn: sendInvite,
        onSuccess: () => {
            toast.success("Invite sent successfully")
            refetchAccounts()
            close()
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to send invite")
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
        department: Yup
            .string()
            .required("Department is required."),
    })

    const formik = useFormik({
        initialValues: {
            email: "",
            role: "",
            department: ""
        },
        validationSchema,
        onSubmit: () => {
            sendInviteMutation()
        }
    })

    return {
        formik,
        isInvitePending
    }
}
export default useInvite