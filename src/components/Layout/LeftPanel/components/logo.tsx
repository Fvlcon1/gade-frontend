'use client'

import Image from "next/image"
import { useTheme } from "@styles/theme-context"

const fullDarkLogo = (
    <Image
        src="/assets/gade-logo-full-dark.svg"
        alt="GADE Logo"
        width={60}
        height={60}
        className="rounded-full object-cover"
    />
)

const fullLightLogo = (
    <Image
        src="/assets/gade-logo-full-light.svg"
        alt="GADE Logo"
        width={60}
        height={60}
        className="rounded-full object-cover"
    />
)

const logoDark = (
    <Image
        src="/assets/logo-dark.png"
        alt="GADE Logo"
        width={32}
        height={32}
        className="rounded-full object-cover"
    />
)

const logoLight = (
    <Image
        src="/assets/logo-light.png"
        alt="GADE Logo"
        width={32}
        height={32}
        className="rounded-full object-cover"
    />
)

const Logo = ({
    isExpanded
}: {
    isExpanded: boolean
}) => {
    const { themeColor, systemTheme } = useTheme()
    return (
        <div className="rounded-full overflow-hidden">
            {
                isExpanded ? (
                    (themeColor === "dark") ? (
                        fullDarkLogo
                    ) : (themeColor === "light") ? (
                        fullLightLogo
                    ) : systemTheme === "dark" ? (
                        fullDarkLogo
                    ) : fullLightLogo
                ) : (
                    (themeColor === "dark") ? (
                        logoLight
                    ) : logoDark
                )
            }
        </div>
    )
}
export default Logo