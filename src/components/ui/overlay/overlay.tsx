import { ReactNode } from "react";
import { AnimatePresence, motion } from 'framer-motion';

const Overlay = ({
    children,
    className,
    onClick
}: {
    children?: ReactNode;
    className? : string
    onClick?: () => void;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{  opacity: 0 }}
            transition={{duration : 0.2}}
            className={`fixed flex justify-center items-center top-0 left-0 z-[10001] w-[100vw] h-[100vh] bg-[#15151f5b] backdrop-filter backdrop-blur-sm ${className}`}
        >
            <div className="fixed flex top-0 left-0 z-[-1] w-full h-full"
                onClick={onClick}
            >
            
            </div>
            {children}
        </motion.div>
    );
};

export default Overlay;
