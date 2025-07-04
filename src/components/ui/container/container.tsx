import ClickableTab from "../clickable/clickabletab";
import theme from "@styles/theme";
import { IoMdCloseCircle } from "react-icons/io";
import { ReactNode, HTMLAttributes } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    className?: string;
    isVisible: boolean;
    close?: () => void;
    closable?: boolean;
    onClose?: () => void;
}

const Container = ({
    children,
    className,
    isVisible,
    close,
    closable = true,
    onClose,
    ...divProps
}: ContainerProps) => {
    const handleClose = () => {
        if(close) close();
        if (onClose) onClose();
    };

    return (
        isVisible && (
            <div
                className={`min-w-[300px] flex flex-col items-center relative rounded-[20px] bg-bg-primary ${className}`}
                {...divProps}
            >
                {closable && (
                    <div className="absolute top-[10px] z-10 right-[10px]">
                        <ClickableTab className="!rounded-full hover:!bg-bg-tetiary" onClick={handleClose}>
                            <IoMdCloseCircle color={theme.colors.text.secondary} />
                        </ClickableTab>
                    </div>
                )}
                {children}
            </div>
        )
    );
};

export default Container;
