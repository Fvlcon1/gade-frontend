'use client'

import { hexOpacity } from "@/utils/hexOpacity"
import theme from "@styles/theme"
import { InputHTMLAttributes, ReactNode, useEffect, useRef, useState } from "react"
import { Label } from "@/components/ui/label"

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    className?: string;
    inputClassName?: string;
    PreIcon?: ReactNode;
    PostIcon?: ReactNode;
    borderColor?: string;
    autoSelect?: boolean;
    label?: string; 
};

const Input = ({
    className, // For the outer div
    inputClassName, // For the inner input
    PreIcon,
    PostIcon,
    borderColor,
    autoSelect,
    label,
    autoFocus,
    ...props
}: InputProps) => {
    const [inputFocus, setInputFocus] = useState<boolean>(autoFocus ?? false);
    const [hover, setHover] = useState<boolean>(false);
    
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (autoSelect) {
            inputRef.current?.select();
        }
    }, [autoSelect]);

    return (
        <div
            className={`flex w-full h-fit flex-1 gap-2 px-[15px] py-[10px] items-center rounded-xl bg-bg-secondary border-border-tetiary border-[1px] border-solid duration-200 ${className}`}
            style={{
                borderColor: (inputFocus || hover) ? theme.colors.main.primary : borderColor || theme.colors.border.secondary
            }}
        >
            {label && <Label className="!text-gray-700 text-sm font-medium pr-2">{label}</Label>}
            {PreIcon && PreIcon}
            <input
                ref={inputRef}
                className={`flex w-full flex-1 bg-transparent h-fit outline-none placeholder:text-[12px] placeholder:text-text-tetiary text-text-primary md:text-[12px] text-[16px] ${inputClassName}`}
                onFocus={(e) => {
                    setInputFocus(true);
                    props.onFocus?.(e);
                }}
                onBlur={(e) => {
                    setInputFocus(false);
                    props.onBlur?.(e);
                }}
                onMouseOver={(e) => {
                    setHover(true);
                    props.onMouseOver?.(e);
                }}
                onMouseLeave={(e) => {
                    setHover(false);
                    props.onMouseLeave?.(e);
                }}
                autoFocus={autoFocus}
                {...props}
            />
            {PostIcon && PostIcon}
        </div>
    );
};

export default Input;
