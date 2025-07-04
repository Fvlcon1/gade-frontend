import FormInput from "@components/ui/form input/formInput"
import Button from "@components/ui/button/button"
import Dropdown from "@components/ui/dropdown/dropdown"
import theme from "@styles/theme"
import { useFormik } from "formik"
import { MdEmail } from "react-icons/md"
import { RiUserAddLine } from "react-icons/ri"
import * as Yup from 'yup'
import { DropdownItem } from "@/utils/@types"
import { BiChevronDown } from "react-icons/bi"
import useInvite from "./hooks/useInvite"
import { IoSend } from "react-icons/io5"
import OutlineButton from "@components/ui/button/outlineButton"

const Form = ({
    close
}: {
    close: () => void
}) => {
    const { formik, isInvitePending } = useInvite({ close })

    const dropdownItems: DropdownItem[] = [
        { key: "1", label: "Admin", onClick: () => { formik.setFieldValue("role", "ADMIN") }, isSelected: formik.values.role === "ADMIN" },
        { key: "2", label: "Standard", onClick: () => { formik.setFieldValue("role", "STANDARD") }, isSelected: formik.values.role === "STANDARD" },
    ]

    const departmentDropdown: DropdownItem[] = [
        { key: "1", label: "GADE Team", onClick: () => { formik.setFieldValue("department", "GADE Team") }, isSelected: formik.values.department === "GADE Team" },
        { key: "2", label: "Minerals Department", onClick: () => { formik.setFieldValue("department", "Minerals Department") }, isSelected: formik.values.department === "Minerals Department" },
        { key: "3", label: "Forestry Department", onClick: () => { formik.setFieldValue("department", "Forestry Department") }, isSelected: formik.values.department === "Forestry Department" },
        { key: "4", label: "Ghana Armed Forces", onClick: () => { formik.setFieldValue("department", "Ghana Armed Forces") }, isSelected: formik.values.department === "Ghana Armed Forces" },
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
                    onClick={() => close()}
                />
                <Button
                    text="Send Invite"
                    icon={<IoSend size={13} />}
                    loading={isInvitePending}
                    loadingColor={theme.colors.bg.primary}
                />
            </div>
        </form>
    )
}
export default Form