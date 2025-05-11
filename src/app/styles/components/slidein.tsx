'use client'

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

const Slidein = ({
    children,
    width,
    direction,
    className
} : {
    children : ReactNode,
    width? : string,
    direction? : 'top' | 'right' | 'bottom' | 'left',
    className? : string
}) => {
    return (
        <motion.div
            className={`w-fit ${className}`}
            initial={{ 
                opacity: 0, 
                y : direction === 'top'
                        ? 20
                        : direction === 'bottom'
                        ? -20
                        : 20,
                x : direction === 'left'
                        ? 20
                        : direction === 'right'
                        ? -20
                        : 0
            }}
            animate={{ 
                opacity: 1, 
                y : 0,
                x : 0
            }}
            transition={{
                delay : 0,
                type: "spring", 
                stiffness: 50,
                duration : 100
            }}
        >
            {children}
        </motion.div>
    )
}

export default Slidein