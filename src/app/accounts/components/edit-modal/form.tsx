import FormInput from "@components/ui/form input/formInput"
import Button from "@components/ui/button/button"
import Dropdown from "@components/ui/dropdown/dropdown"
import theme from "@styles/theme"
import { useFormik } from "formik"
import { MdEmail } from "react-icons/md"
import { RiUserAddLine } from "react-icons/ri"
import * as Yup from 'yup'
import { useState } from "react"
import { DropdownItem } from "@/utils/@types"
import { useRef } from "react"
import { BiChevronDown } from "react-icons/bi"
import useEditUser from "./hooks/useEditUser"
import OutlineButton from "@components/ui/button/outlineButton"
import { IoSend } from "react-icons/io5"
import { IUserInfo } from "../../utils/types"
import { departmentList } from "@/utils/constants"

const Form = ({
    close,
    user
}: {
    close: () => void,
    user: IUserInfo
}) => {
    const { formik, isEditPending } = useEditUser({ close, user })

    const dropdownItems: DropdownItem[] = [
        { key: "1", label: "Admin", onClick: () => { formik.setFieldValue("role", "ADMIN") }, isSelected: formik.values.role === "ADMIN" },
        { key: "2", label: "Standard", onClick: () => { formik.setFieldValue("role", "STANDARD") }, isSelected: formik.values.role === "STANDARD" },
    ]

    const departmentDropdown = departmentList.map((department, index) => ({
        key: index.toString(),
        label: department,
        value: department,
        isSelected: formik.values.department === department,
    }))

    return (
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-2">
            <FormInput
                value={formik.values.email}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                touched={formik.touched.email}
                error={formik.errors.email}
                PreIcon={<MdEmail color={theme.colors.text.tetiary} />}
                name="email"
                type="text"
                placeholder="Eg: johndoe@paiv.com"
                label="Email"
                autoComplete="username"
                disabled
            />

            <Dropdown
                menuItems={departmentDropdown}
                onChange={(value) => formik.setFieldValue("department", value)}
            >
                <FormInput
                    value={formik.values.department}
                    handleChange={formik.handleChange}
                    touched={formik.touched.department}
                    error={formik.errors.department}
                    PreIcon={<MdEmail color={theme.colors.text.tetiary} />}
                    PostIcon={<BiChevronDown color={theme.colors.text.tetiary} />}
                    name="department"
                    type="text"
                    placeholder="Select department"
                    label="Department"
                    autoComplete="off"
                />
            </Dropdown>

            <Dropdown
                menuItems={dropdownItems}
            >
                <FormInput
                    value={formik.values.role}
                    handleChange={formik.handleChange}
                    touched={formik.touched.role}
                    error={formik.errors.role}
                    PreIcon={<RiUserAddLine color={theme.colors.text.tetiary} />}
                    PostIcon={<BiChevronDown color={theme.colors.text.tetiary} />}
                    name="role"
                    type="text"
                    placeholder="Select role"
                    label="Role"
                    autoComplete="off"
                />
            </Dropdown>

            <div className="flex gap-2 justify-end items-center">
                <OutlineButton
                    text="Cancel"
                    type="button"
                    onClick={() => close()}
                />
                <Button
                    text="Edit User"
                    loading={isEditPending}
                    loadingColor={theme.colors.bg.primary}
                />
            </div>
        </form>
    )
}
export default Form