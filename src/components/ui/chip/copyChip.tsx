"use client";

import Pressable from "@components/ui/button/pressable";
import Text from "@styles/components/text";
import theme from "@styles/theme";
import { ReactNode, useState } from "react";
import { IoCopy } from "react-icons/io5";

const Copychip = ({
    children,
    containerClassName = "",
    text = "",
}: {
    children?: ReactNode;
    containerClassName?: string;
    text?: string;
}) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const copyText = text || (typeof children === "string" ? children : "");
        if (!copyText) return;

        navigator.clipboard
            .writeText(copyText)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch((err) => console.error("Failed to copy:", err));
    };

    return (
        <div className="relative flex flex-col items-center w-fit">
            {copied && (
                <div className="absolute top-[-2.2rem] left-1/2 -translate-x-1/2 bg-bg-tetiary px-2 py-1 rounded-md">
                    <Text textColor={theme.colors.text.primary}>Copied</Text>
                </div>
            )}

            <Pressable scaleFactor={1.015}>
                <div
                    className={`relative px-3 py-1 bg-bg-tetiary flex justify-center items-center overflow-hidden hover:bg-bg-quantinary rounded-lg cursor-pointer w-fit group ${containerClassName}`}
                    onClick={handleCopy}
                >
                    {children ?? <Text>{text}</Text>}

                    <div className="absolute right-0 top-0 px-2 flex items-center justify-center h-full bg-[#00000006] backdrop-filter backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <IoCopy color={theme.colors.text.primary} />
                    </div>
                </div>
            </Pressable>
        </div>
    );
};

export default Copychip;
