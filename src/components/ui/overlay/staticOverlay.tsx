import { ReactNode } from "react";
import { AnimatePresence, motion } from 'framer-motion';

const StaticOverlay = ({
    children,
    className,
    onClick
}: {
    children?: ReactNode;
    className? : string
    onClick?: () => void;
}) => {
    return (
        <div className={`fixed flex justify-center items-center top-0 left-0 z-[100] w-[100vw] h-[100vh] bg-[#15151f5b] backdrop-filter backdrop-blur-sm ${className}`}>
            <div className="fixed flex top-0 left-0 z-[-1] w-full h-full"
                onClick={onClick}
            >
            
            </div>
            {children}
        </div>
    );
};

export default StaticOverlay;
