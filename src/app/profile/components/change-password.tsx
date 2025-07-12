
'use client'

import Container from "@components/ui/container/container"
import Overlay from "@components/ui/overlay/overlay"
import { AnimatePresence } from "framer-motion"
import { FaEye, FaUnlockKeyhole } from "react-icons/fa6"
import { useTheme } from "@styles/theme-context"
import { MdLock, MdLockReset } from "react-icons/md"
import Text from "@styles/components/text"
import Input from "@components/ui/input/input"
import Button from "@components/ui/button/button"
import OutlineButton from "@components/ui/button/outlineButton"
import { BiSolidLock } from "react-icons/bi"
import Link from "next/link"
import { Dispatch, SetStateAction, useEffect } from "react"
import { FaEyeSlash } from "react-icons/fa"
import usePassword from "../hooks/usePassword"

const ChangePassword = ({
    isVisible,
    close
}: {
    isVisible: boolean
    close: () => void
}) => {
    const { theme } = useTheme();
    const { formik, passwordCriteria, showCurrentPassword, showNewPassword, showConfirmPassword, setShowCurrentPassword, setShowNewPassword, setShowConfirmPassword, isUpdatePasswordPending, isUpdatePasswordSuccess } = usePassword();

    useEffect(() => {
        if (isUpdatePasswordSuccess) {
            close();
        }
    }, [isUpdatePasswordSuccess]);

    const ShowPassowrdEye = (isVisisble: boolean, setShow: Dispatch<SetStateAction<boolean>>) => {
        return (
            isVisisble
                ? <FaEye className="cursor-pointer" color={theme.colors.text.tetiary} size={15} onClick={() => setShow(prev => !prev)} />
                : <FaEyeSlash className="cursor-pointer" color={theme.colors.text.tetiary} size={15} onClick={() => setShow(prev => !prev)} />
        )
    }

    useEffect(() => {
        formik.resetForm();
    }, [isVisible]);

    return (
        <AnimatePresence>
            {
                isVisible && (
                    <Overlay
                        onClick={close}
                        key={1}
                    >
                        <Container
                            isVisible={isVisible}
                            close={close}
                            className="border-[1px] border-border-primary"
                        >
                            <div className="w-[400px] flex flex-col rounded-xl py-6 px-6 gap-3">
                                <div className="w-full flex flex-col gap-1.5 items-center">
                                    <div className="bg-main-primary/30 rounded-full p-2">
                                        <div className="bg-main-primary rounded-full p-2 shadow-lg shadow-main-primary/50">
                                            <BiSolidLock color="white" size={20} />
                                        </div>
                                    </div>
                                    <Text
                                        size={theme.text.size.HM}
                                        bold={theme.text.bold.md2}
                                        textColor={theme.colors.main.primary}
                                    >
                                        Update Password
                                    </Text>
                                    <Text textColor={theme.colors.text.tetiary}>
                                        Please fill the form below to update your password
                                    </Text>
                                </div>

                                {/* Form */}
                                <div className="w-full flex flex-col gap-3 mt-3">
                                    <div className="flex flex-col gap-1.5">
                                        <Text
                                            bold={theme.text.bold.md}
                                        >
                                            Current Password
                                        </Text>
                                        <Input
                                            placeholder="Current Password"
                                            value={formik.values.currentPassword}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            name="currentPassword"
                                            PreIcon={<MdLock color={theme.colors.text.tetiary} />}
                                            type={showCurrentPassword ? "text" : "password"}
                                            PostIcon={ShowPassowrdEye(showCurrentPassword, setShowCurrentPassword)}
                                            className="!shadow-xs"
                                            borderColor={formik.touched.currentPassword && formik.errors.currentPassword ? theme.colors.text.danger : theme.colors.border.primary}
                                        />
                                        {
                                            formik.touched.currentPassword && formik.errors.currentPassword && (
                                                <Text
                                                    textColor={theme.colors.text.danger}
                                                >
                                                    {formik.errors.currentPassword}
                                                </Text>
                                            )
                                        }
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <Text
                                            bold={theme.text.bold.md}
                                        >
                                            New Password
                                        </Text>
                                        <Input
                                            placeholder="New Password"
                                            value={formik.values.newPassword}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            name="newPassword"
                                            PreIcon={<MdLock color={theme.colors.text.tetiary} />}
                                            type={showNewPassword ? "text" : "password"}
                                            PostIcon={ShowPassowrdEye(showNewPassword, setShowNewPassword)}
                                            className="!shadow-xs"
                                            borderColor={formik.touched.newPassword && formik.errors.newPassword ? theme.colors.text.danger : theme.colors.border.primary}
                                        />
                                        {
                                            formik.touched.newPassword && formik.errors.newPassword && (
                                                <Text
                                                    textColor={theme.colors.text.danger}
                                                >
                                                    {formik.errors.newPassword}
                                                </Text>
                                            )
                                        }
                                        <div className="flex flex-col gap-2">
                                            {
                                                passwordCriteria.map((criteria, index) => (
                                                    <Text
                                                        key={index}
                                                        className="pl-0.5"
                                                        textColor={criteria.met ? theme.colors.text.success : theme.colors.text.tetiary}
                                                    >
                                                        {criteria.met ? "✓ " : "𒉽 "}{criteria.text}
                                                    </Text>
                                                ))
                                            }
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <Text
                                            bold={theme.text.bold.md}
                                        >
                                            Confirm New Password
                                        </Text>
                                        <Input
                                            placeholder="Confirm New Password"
                                            value={formik.values.confirmPassword}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            name="confirmPassword"
                                            PreIcon={<MdLock color={theme.colors.text.tetiary} />}
                                            type={showConfirmPassword ? "text" : "password"}
                                            PostIcon={ShowPassowrdEye(showConfirmPassword, setShowConfirmPassword)}
                                            className="!shadow-xs"
                                            borderColor={formik.touched.confirmPassword && formik.errors.confirmPassword ? theme.colors.text.danger : theme.colors.border.primary}
                                        />
                                        {
                                            formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                                <Text
                                                    textColor={theme.colors.text.danger}
                                                >
                                                    {formik.errors.confirmPassword}
                                                </Text>
                                            )
                                        }
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-1">
                                    <div className="w-full flex items-center gap-2">
                                        <Button
                                            text="Update Password"
                                            onClick={formik.handleSubmit as any}
                                            loading={isUpdatePasswordPending}
                                            className="!w-full"
                                        />
                                        <OutlineButton
                                            text="Cancel"
                                            onClick={close}
                                            className="!w-full"
                                        />
                                    </div>

                                    <Link href="#">
                                        <Text
                                            textColor={theme.colors.main.primary}
                                            bold={theme.text.bold.md}
                                            className="hover:!underline !cursor-pointer"
                                        >
                                            Forgot Password?
                                        </Text>
                                    </Link>
                                </div>
                            </div>
                        </Container>
                    </Overlay>
                )
            }
        </AnimatePresence>
    )
}
export default ChangePassword