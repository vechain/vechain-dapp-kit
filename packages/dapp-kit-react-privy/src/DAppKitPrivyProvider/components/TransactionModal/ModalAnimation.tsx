import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export const ModalAnimation = ({ children }: { children: ReactNode }) => {
    const containerVariants = {
        initial: {
            x: 30,
        },
        animate: {
            x: 0,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2,
            },
        },
    };
    return (
        <motion.div
            initial="initial"
            animate="animate"
            variants={containerVariants}
        >
            {children}
        </motion.div>
    );
};
