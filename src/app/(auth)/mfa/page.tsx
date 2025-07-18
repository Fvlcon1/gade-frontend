'use client'

import { Video, FullDarkLogo, Footer } from "../components/auth-components"
import Text from "@styles/components/text"
import { useTheme } from "@styles/theme-context"
import { useState, useEffect, useRef } from "react"
import Input from "@components/ui/input/input"
import Button from "@components/ui/button/button"
import { useRouter, redirect } from "next/navigation"
import { useAuthStore } from "@/lib/store/auth-store"
import useMfa from "./use-mfa"
import { ImSpinner10 } from "react-icons/im"

const CODE_LENGTH = 6
const RESEND_TIMEOUT = 30 // seconds

const MfaForm = () => {
    const { theme } = useTheme()
    const [isMounted, setIsMounted] = useState(false)
    const [code, setCode] = useState(Array(CODE_LENGTH).fill(''))
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])
    const [resendTimer, setResendTimer] = useState(RESEND_TIMEOUT)
    const router = useRouter()
    const {pendingLogin} = useAuthStore()
    const {verifyOtpMutation, verifyOtpLoading, verifyOtpError, resendOtpMutation, resendOtpLoading, resendOtpError} = useMfa()

    if(!pendingLogin) redirect("/login")

    useEffect(() => {
        setIsMounted(true)
        inputRefs.current[0]?.focus()
    }, [])

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1)
            }, 1000)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [resendTimer])

    const handleChange = (value: string, index: number) => {
        if (!/^\d?$/.test(value)) return // only allow digits

        const newCode = [...code]
        newCode[index] = value
        setCode(newCode)

        if (value && index < CODE_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        const paste = e.clipboardData.getData('text').slice(0, CODE_LENGTH)
        if (!/^\d+$/.test(paste)) return

        const newCode = paste.split('')
        setCode((prev) => prev.map((_, i) => newCode[i] || ''))

        const nextIndex = newCode.length >= CODE_LENGTH ? CODE_LENGTH - 1 : newCode.length
        inputRefs.current[nextIndex]?.focus()
    }

    const handleResend = () => {
        if (resendTimer === 0) {
            // trigger resend logic
            setResendTimer(RESEND_TIMEOUT)
            resendOtpMutation()
        }
    }

    const handleSubmit = () => {
        verifyOtpMutation(code.join(''))
    }

    useEffect(() => {
        const isComplete = code.every((digit) => digit !== '')
        if (isComplete) {
            handleSubmit()
        }
    }, [code])    

    if (!isMounted) return null

    const maskEmail = (email: string) => {
        return email.replace(/(.)(.*)(@.*)/, "$1*****$3")
    }

    return (
        <div className="flex flex-1 items-center justify-center">
            <div className="w-[80%] flex flex-col items-center gap-5">
                <div className="flex flex-col gap-1.5 items-center">
                    <Text size={theme.text.size.HM} bold={theme.text.bold.md}>
                        Email Verification
                    </Text>
                    <Text>
                        We sent a code to <b>{maskEmail(pendingLogin.email)}</b>
                    </Text>
                </div>

                <div className="flex gap-2" onPaste={handlePaste}>
                    {code.map((digit, index) => (
                        <Input
                            key={index}
                            ref={(el) => {
                                inputRefs.current[index] = el
                            }}
                            placeholder=""
                            value={digit}
                            name={`code-${index}`}
                            disabled={verifyOtpLoading || resendOtpLoading}
                            required
                            inputProps={{
                                inputMode: "numeric",
                                maxLength: 1,
                                onKeyDown: (e) => handleKeyDown(e, index)
                            }}
                            className="!bg-transparent !shadow text-xl w-10 h-12 rounded-md border"
                            inputClassName="text-center"
                            onChange={(e) => handleChange(e.target.value, index)}
                        />
                    ))}
                </div>

                {
                    resendOtpLoading ? (
                        <div className="flex items-center gap-2">
                            <ImSpinner10 className="animate-spin" color={theme.colors.text.secondary} size={15} />
                            <Text>Resending...</Text>
                        </div>
                    ) : null
                }

                {
                    verifyOtpLoading ? (
                        <div className="flex items-center gap-2">
                            <ImSpinner10 className="animate-spin" color={theme.colors.text.secondary} size={15} />
                            <Text>Verifying...</Text>
                        </div>
                    ) : null
                }

                <div className="flex flex-col gap-1 items-center">
                    <Text textColor={theme.colors.text.tetiary}>
                        Didn&apos;t receive a code?
                    </Text>
                    <Text
                        textColor={
                            resendTimer === 0
                                ? theme.colors.main.primary
                                : theme.colors.text.secondary
                        }
                        bold={resendTimer === 0 ? theme.text.bold.md : theme.text.bold.sm2}
                        underline={resendTimer === 0}
                        className={`cursor-pointer duration-300 ${
                            resendTimer === 0 ? "hover:!opacity-70" : "cursor-not-allowed"
                        }`}
                        onClick={handleResend}
                    >
                        {resendTimer > 0
                            ? `Resend code in ${resendTimer}s`
                            : "Resend code"}
                    </Text>
                </div>

                <Button
                    text="Go back to login"
                    className="!w-[200px]"
                    onClick={() => router.push('/login')}
                />

                {verifyOtpError && <Text textColor={theme.colors.text.danger}>{verifyOtpError.response?.data?.message}</Text>}
                {resendOtpError && <Text textColor={theme.colors.text.danger}>{resendOtpError.response?.data?.message}</Text>}
            </div>
        </div>
    )
}

const Mfa = () => {
    return (
        <div className="relative w-screen h-screen overflow-hidden">
            <Video />
            <div className="absolute top-0 left-0 w-full h-full z-10 bg-black opacity-50" />
            <div className="relative z-10 flex flex-col gap-14 p-4 items-center justify-center w-full h-full">
                <FullDarkLogo />
                <div className="w-[450px] h-[380px] flex backdrop-blur-sm bg-black/70 rounded-2xl p-4">
                    <MfaForm />
                </div>
                <Footer />
            </div>
        </div>
    )
}
export default Mfa
