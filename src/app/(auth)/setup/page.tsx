'use client'

import Button from "@components/ui/button/button"
import Input from "@components/ui/input/input"
import Text from "@styles/components/text"
import { useTheme } from "@styles/theme-context"
import Image from "next/image"
import { useEffect, useState } from "react"
import { GoDotFill } from "react-icons/go"
import { Footer, FullDarkLogo, SideImage, Video } from "../components/auth-components"
import { useRouter } from "next/navigation"
import { MdEmail } from "react-icons/md"
import { BiSolidUserPin, BiUserCircle } from "react-icons/bi"
import { FaAt, FaUserCircle } from "react-icons/fa"
import { RiEyeCloseLine, RiEyeLine, RiLockPasswordFill } from "react-icons/ri"
import { IoIosAt } from "react-icons/io"
import useRegister from "./hooks/use-register"
import { useSearchParams } from "next/navigation"
import { TiWarning } from "react-icons/ti"

const RegisterForm = () => {
    const { theme } = useTheme()
    const [isMounted, setIsMounted] = useState(false)
    const router = useRouter()
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)
    const { formik, passwordCriteria, registerLoading, registerError } = useRegister()

    useEffect(() => {
        setIsMounted(true)
    }, [])

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

    const ConfirmPasswordIcon = () => {
        return (
            <>
                {
                    isConfirmPasswordVisible ? (
                        <RiEyeLine onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} color={theme.darkColors.text.tetiary} />
                    ) : (
                        <RiEyeCloseLine onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} color={theme.darkColors.text.tetiary} />
                    )
                }
            </>
        )
    }

    if (!isMounted) return null

    return (
        <div className="flex flex-1 items-center justify-center">
            <form onSubmit={formik.handleSubmit} className="w-[80%] flex flex-col gap-3 py-4">
                <div className="flex flex-col gap-1.5 mb-2">
                    <Text
                        size={theme.text.size.HM}
                        bold={theme.text.bold.md}
                    >
                        Set up your account
                    </Text>
                    <Text textColor={theme.darkColors.text.tetiary}>
                        Enter your credentials to set up your account
                    </Text>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1.5">
                        <Text>
                            First Name
                        </Text>
                        <Input
                            placeholder="First Name"
                            value={formik.values.firstname}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            PreIcon={<BiSolidUserPin color={theme.darkColors.text.tetiary} />}
                            type="text"
                            name="firstname"
                            required
                            className={`!bg-transparent !shadow ${formik.touched.firstname && formik.errors.firstname ? "!border-text-danger" : ""}`}
                        />
                        {formik.touched.firstname && formik.errors.firstname && <Text textColor={theme.darkColors.text.danger}>{formik.errors.firstname}</Text>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Text>
                            Last Name
                        </Text>
                        <Input
                            placeholder="Last Name"
                            value={formik.values.lastname}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            PreIcon={<BiSolidUserPin color={theme.darkColors.text.tetiary} />}
                            type="text"
                            name="lastname"
                            required
                            className={`!bg-transparent !shadow ${formik.touched.lastname && formik.errors.lastname ? "!border-text-danger" : ""}`}
                        />
                        {formik.touched.lastname && formik.errors.lastname && <Text textColor={theme.darkColors.text.danger}>{formik.errors.lastname}</Text>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Text>
                            Username
                        </Text>
                        <Input
                            placeholder="Username"
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            PreIcon={<IoIosAt color={theme.darkColors.text.tetiary} />}
                            type="text"
                            name="username"
                            required
                            className={`!bg-transparent !shadow ${formik.touched.username && formik.errors.username ? "!border-text-danger" : ""}`}
                        />
                        {formik.touched.username && formik.errors.username && <Text textColor={theme.darkColors.text.danger}>{formik.errors.username}</Text>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Text>
                            Password
                        </Text>
                        <Input
                            placeholder="Password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            PreIcon={<RiLockPasswordFill color={theme.darkColors.text.tetiary} />}
                            PostIcon={<PasswordIcon />}
                            type={isPasswordVisible ? "text" : "password"}
                            name="password"
                            required
                            className={`!bg-transparent !shadow ${formik.touched.password && formik.errors.password ? "!border-text-danger" : ""}`}
                        />
                        <div className="flex flex-col gap-2">
                            {formik.touched.password &&
                                passwordCriteria.map((criteria, index) => (
                                    <Text
                                        key={index}
                                        className="pl-[1px]"
                                        textColor={criteria.met ? theme.darkColors.text.success : theme.darkColors.text.tetiary}
                                    >
                                        {criteria.met ? "✓ " : "𒉽 "}{criteria.text}
                                    </Text>
                                ))
                            }
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Text>
                            Confirm Password
                        </Text>
                        <Input
                            placeholder="Confirm Password"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            PreIcon={<RiLockPasswordFill color={theme.darkColors.text.tetiary} />}
                            PostIcon={<ConfirmPasswordIcon />}
                            type={isConfirmPasswordVisible ? "text" : "password"}
                            name="confirmPassword"
                            required
                            className={`!bg-transparent !shadow ${formik.touched.confirmPassword && formik.errors.confirmPassword ? "!border-text-danger" : ""}`}
                        />
                        {formik.touched.confirmPassword && formik.errors.confirmPassword && <Text textColor={theme.darkColors.text.danger}>{formik.errors.confirmPassword}</Text>}
                    </div>
                </div>

                <Button
                    text="Register"
                    className="!w-full"
                    type="submit"
                    loading={registerLoading}
                />

                <div className="w-full flex items-center mt-1">
                    <Text textColor={theme.darkColors.text.tetiary}>
                        Already have an account?&nbsp;
                    </Text>
                    <Text
                        textColor={theme.darkColors.main.primary}
                        bold={theme.text.bold.md}
                        underline
                        className="cursor-pointer duration-300 hover:!opacity-70"
                        onClick={() => router.push('/login')}
                    >
                        Login
                    </Text>
                </div>

                {
                    registerError && (
                        <Text textColor={theme.darkColors.text.danger}>
                            {registerError.response.data.message}
                        </Text>
                    )
                }
            </form>
        </div>
    )
}

const InvalidToken = () => {
    const router = useRouter()
    const { theme } = useTheme()

    return (
        <div className="w-[400px] py-6 flex flex-col gap-2 items-center backdrop-blur-sm bg-black/70 rounded-2xl p-8">
            <div className="flex p-2 rounded-full bg-white/10">
                <div className="flex p-2 rounded-full bg-white/10">
                    <TiWarning />
                </div>
            </div>
            <Text
                size={theme.text.size.HM2}
                bold={theme.text.bold.md}
            >
                Invalid Token
            </Text>
            <Text textAlign="center" textColor={theme.darkColors.text.tetiary}>
                The registration link is invalid or has expired, please contact your administrator for a valid registration link.
            </Text>
            <Button
                text="Login"
                className="!w-[200px]"
                onClick={() => router.push('/login')}
            />
        </div>
    )
}

const Register = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    return (
        <div className="relative w-screen h-screen overflow-hidden">
            <Video />
            <div className="absolute top-0 left-0 w-full h-full z-10 bg-black opacity-50" />
            <div className="relative z-10 flex flex-col gap-14 p-4 items-center justify-center w-full h-full">
                <FullDarkLogo />
                {
                    !token ? (
                        <InvalidToken />
                    ) : (
                        <div className="w-[900px] flex backdrop-blur-sm bg-black/70 rounded-2xl p-4">
                            <RegisterForm />
                            <SideImage />
                        </div>
                    )
                }
                <Footer />
            </div>
        </div>
    )
}
export default Register