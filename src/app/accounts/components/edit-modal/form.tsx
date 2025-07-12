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

    const departmentDropdown: DropdownItem[] = [
        { key: "1", label: "Minerals Commission", onClick: () => { formik.setFieldValue("department", "Minerals Commission") }, isSelected: formik.values.department === "Minerals Commission" },
        { key: "2", label: "Lands Commission", onClick: () => { formik.setFieldValue("department", "Lands Commission") }, isSelected: formik.values.department === "Lands Commission" },
        { key: "3", label: "Forestry Commission", onClick: () => { formik.setFieldValue("department", "Forestry Commission") }, isSelected: formik.values.department === "Forestry Commission" },
        { key: "4", label: "Office of Administrator of Stool lands", onClick: () => { formik.setFieldValue("department", "Office of Administrator of Stool lands") }, isSelected: formik.values.department === "Office of Administrator of Stool lands" },
        { key: "5", label: "Environmental commission", onClick: () => { formik.setFieldValue("department", "Environmental commission") }, isSelected: formik.values.department === "Environmental commission" },
        { key: "6", label: "Goldbod", onClick: () => { formik.setFieldValue("department", "Goldbod") }, isSelected: formik.values.department === "Goldbod" },
        { key: "7", label: "Ghana Police", onClick: () => { formik.setFieldValue("department", "Ghana Police") }, isSelected: formik.values.department === "Ghana Police" },
        { key: "8", label: "Ghana Army", onClick: () => { formik.setFieldValue("department", "Ghana Army") }, isSelected: formik.values.department === "Ghana Army" },
        { key: "9", label: "National Security", onClick: () => { formik.setFieldValue("department", "National Security") }, isSelected: formik.values.department === "National Security" },
        { key: "10", label: "Geological Survey Authority", onClick: () => { formik.setFieldValue("department", "Geological Survey Authority") }, isSelected: formik.values.department === "Geological Survey Authority" },
        { key: "11", label: "Wildlife Division", onClick: () => { formik.setFieldValue("department", "Wildlife Division") }, isSelected: formik.values.department === "Wildlife Division" },
        { key: "12", label: "Ghana Space Science and Technology Institute", onClick: () => { formik.setFieldValue("department", "Ghana Space Science and Technology Institute") }, isSelected: formik.values.department === "Ghana Space Science and Technology Institute" },
        { key: "13", label: "Water Resources Commission", onClick: () => { formik.setFieldValue("department", "Water Resources Commission") }, isSelected: formik.values.department === "Water Resources Commission" },
        { key: "14", label: "Land Use and Spatial Planning", onClick: () => { formik.setFieldValue("department", "Land Use and Spatial Planning") }, isSelected: formik.values.department === "Land Use and Spatial Planning" },
        { key: "15", label: "National Anti-Illegal Mining Operations Secretariat", onClick: () => { formik.setFieldValue("department", "National Anti-Illegal Mining Operations Secretariat") }, isSelected: formik.values.department === "National Anti-Illegal Mining Operations Secretariat" },
        { key: "16", label: "GADE Team", onClick: () => { formik.setFieldValue("department", "GADE Team") }, isSelected: formik.values.department === "GADE Team" },
    ]

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