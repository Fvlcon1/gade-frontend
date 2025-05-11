'use client'

import Text from "@styles/components/text"
import { TypographySize } from "@styles/style.types"
import theme from "@styles/theme"
import { IoCloudOffline } from "react-icons/io5"

const NoData = () => {
    return (
        <div className="w-full rounded-lg h-[150px] justify-center items-center duration-500 flex">
            <div className="flex flex-col gap-2 items-center max-w-[200px]">
                <IoCloudOffline
                    color={theme.colors.text.tetiary}
                    size={25}
                />
                <Text 
                    textAlign="center"
                    textColor={theme.colors.text.tetiary}
                    size={TypographySize.xs}
                >
                    No Available Data
                </Text>
            </div>
        </div>
    )
}
export default NoData