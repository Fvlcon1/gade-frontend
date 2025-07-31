'use client'

import Button from "@components/ui/button/button"
import Input from "@components/ui/input/input"
import Text from "@styles/components/text"
import { useTheme } from "@styles/theme-context"
import Image from "next/image"
import { useEffect, useState } from "react"
import { GoDotFill } from "react-icons/go"
import {Footer, FullDarkLogo, SideImage, Video} from "../components/auth-components"
import { MdEmail } from "react-icons/md"
import { RiLockPasswordFill, RiEyeCloseLine, RiEyeLine } from "react-icons/ri"
import useLogin from "./hooks/use-login"
import { useAuth } from "@/hooks/use-auth"

const SigninForm = () => {
    const { theme } = useTheme()
    const [isMounted, setIsMounted] = useState(false)
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const { formik, loginMutation, loginLoading, loginError } = useLogin()

    const PasswordIcon = () => {
        return (
            <>
                {
                    isPasswordVisible ? (
                        <RiEyeLine className="cursor-pointer" onClick={() => setIsPasswordVisible(!isPasswordVisible)} color={theme.darkColors.text.tetiary} />
                    ) : (
                        <RiEyeCloseLine className="cursor-pointer" onClick={() => setIsPasswordVisible(!isPasswordVisible)} color={theme.darkColors.text.tetiary} />
                    )
                }
            </>
        )
    }

    useEffect(() => {
        setIsMounted(true)
    }, [])
    
    if(!isMounted) return null
    
    return (
        <div className="flex flex-1 items-center justify-center">
            <form onSubmit={formik.handleSubmit} className="w-[80%] flex flex-col gap-3">
                <div className="flex flex-col gap-1.5 mb-2">
                    <Text
                        size={theme.text.size.HM}
                        bold={theme.text.bold.md}
                        textColor={theme.darkColors.text.secondary}
                    >
                        Sign in to <b>GADE</b>
                    </Text>
                    <Text textColor={theme.darkColors.text.tetiary}>
                        Enter your credentials to access your account
                    </Text>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1.5">
                        <Text textColor={theme.darkColors.text.secondary}>
                            Email
                        </Text>
                        <Input
                            placeholder="Email"
                            PreIcon={<MdEmail color={theme.darkColors.text.tetiary} />}
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            type="text"
                            name="email"
                            required
                            borderColor={theme.darkColors.border.secondary}
                            className={`!bg-transparent !shadow ${formik.touched.email && formik.errors.email ? "!border-text-danger" : ""}`}
                        />
                        {formik.touched.email && formik.errors.email && <Text textColor={theme.darkColors.text.danger}>{formik.errors.email}</Text>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Text textColor={theme.darkColors.text.secondary}>
                            Password
                        </Text>
                        <Input
                            placeholder="Password"
                            PreIcon={<RiLockPasswordFill color={theme.darkColors.text.tetiary} />}
                            PostIcon={<PasswordIcon />}
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            type={isPasswordVisible ? "text" : "password"}
                            name="password"
                            required
                            borderColor={theme.darkColors.border.secondary}
                            className={`!bg-transparent !shadow ${formik.touched.password && formik.errors.password ? "!border-text-danger" : ""}`}
                        />
                        {formik.touched.password && formik.errors.password && <Text textColor={theme.darkColors.text.danger}>{formik.errors.password}</Text>}
                    </div>
                </div>

                <div className="w-full flex items-center justify-end">
                    <Text 
                        className="hover:!underline hover:!opacity-80 duration-200 cursor-pointer"
                        textColor={theme.darkColors.text.tetiary}
                    >
                        Forgot Password?
                    </Text>
                </div>

                <Button
                    text="Login"
                    className="!w-full"
                    type="submit"
                    loading={loginLoading}
                />

                <div className="w-full flex items-center justify-center">
                    {loginError && <Text textColor={theme.darkColors.text.danger}>{loginError.response?.data?.message}</Text>}
                </div>
            </form>
        </div>
    )
}

const Login = () => {
    return (
        <div className="relative w-screen h-screen overflow-hidden">
            <Video />
            <div className="absolute top-0 left-0 w-full h-full z-10 bg-black opacity-50" />
            <div className="relative z-10 flex flex-col gap-14 p-4 items-center justify-center w-full h-full">
                <FullDarkLogo />
                <div className="w-[900px] h-[500px] flex backdrop-blur-sm bg-black/70 rounded-2xl p-4">
                    <SigninForm />
                    <SideImage />
                </div>
                <Footer />
            </div>
        </div>
    )
}
export default Login