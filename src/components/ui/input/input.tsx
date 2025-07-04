'use client'

import { hexOpacity } from "@/utils/hexOpacity"
import theme from "@styles/theme"
import { ChangeEventHandler, DetailedHTMLProps, Dispatch, FocusEventHandler, HTMLInputAutoCompleteAttribute, InputHTMLAttributes, ReactNode, SetStateAction, useEffect, useRef, useState } from "react"

type InputProps = {
    className?: string;
    onClick?: () => void;
    placeholder?: string;
    type?: "text" | "number" | "password";
    PreIcon?: ReactNode;
    PostIcon?: ReactNode;
    required?: boolean;
    borderColor?: string;
    inputClassName?: string;
    autofocus?: boolean;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    onBlur?: FocusEventHandler<HTMLInputElement>;
    name?: string;
    ref?: React.Ref<HTMLInputElement>;
    autoSelect?: boolean;
    autoComplete?: HTMLInputAutoCompleteAttribute;
    inputProps?: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
    disabled?: boolean;
} & (
    | { value: string; setValue?: Dispatch<SetStateAction<string>> }
    | { value: number; setValue?: Dispatch<SetStateAction<number>> }
);

const Input = ({
    inputProps,
    className,
    inputClassName,
    placeholder,
    type,
    value,
    autofocus,
    setValue,
    PreIcon,
    PostIcon,
    name,
    onClick,
    onChange,
    onBlur,
    required,
    borderColor,
    ref,
    autoSelect,
    autoComplete,
    disabled
}: InputProps) => {
    const [inputFocus, setInputFocus] = useState<boolean>(autofocus ?? false);
    const [hover, setHover] = useState<boolean>(false);
    
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (autoSelect) {
            inputRef.current?.select();
        }
    }, [autoSelect]);

    return (
        <div
            className={`
                flex w-full h-fit gap-2 px-[15px] py-[10px] items-center rounded-lg bg-bg-primary border-border-primary border-[1px] border-solid duration-200 ${className}
                ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
            onClick={onClick}
            style={{
                borderColor: ((inputFocus || hover) && !disabled) ? theme.colors.main.primary : borderColor || theme.colors.border.primary
            }}
        >
            {PreIcon && PreIcon}
            <input
                {...inputProps}
                ref={ref ?? inputRef}
                placeholder={placeholder ?? inputProps?.placeholder ?? "Input text"}
                style={{
                    fontFamily: "montserrat"
                }}
                type={type ?? inputProps?.type ?? "text"}
                required={required ?? inputProps?.required}
                className={`${disabled ? "cursor-not-allowed" : ""} flex w-full flex-1 bg-transparent font-medium h-fit outline-none placeholder:text-[12px] placeholder:text-text-tetiary text-text-secondary md:text-[12px] text-[16px] ${inputClassName}`}
                onFocus={(e) => {
                    setInputFocus(true);
                    inputProps?.onFocus?.(e);
                }}
                onBlur={(e) => {
                    setInputFocus(false);
                    onBlur?.(e)
                    inputProps?.onBlur?.(e);
                }}
                onMouseOver={(e) => {
                    setHover(true);
                    inputProps?.onMouseOver?.(e);
                }}
                onMouseLeave={(e) => {
                    setHover(false);
                    inputProps?.onMouseLeave?.(e);
                }}
                value={value}
                autoFocus={autofocus ?? inputProps?.autoFocus}
                name={name ?? inputProps?.name}
                onChange={(e) => {
                    onChange ? onChange(e) : setValue && setValue(e.target.value as any);
                    inputProps?.onChange?.(e);
                }}
                autoComplete={autoComplete ?? inputProps?.autoComplete}
                disabled={disabled}
            />
            {PostIcon && PostIcon}
        </div>
    );
};

export default Input;
