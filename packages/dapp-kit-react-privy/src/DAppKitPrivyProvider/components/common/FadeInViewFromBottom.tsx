import { motion } from 'framer-motion';
import React, { ReactNode } from 'react';

type Props = {
    children: ReactNode;
};

export const FadeInViewFromBottom = ({ children }: Props) => {
    return (
        <motion.div
            initial={{ opacity: 1, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, easing: [0.17, 0.55, 0.55, 1] }}
        >
            {children}
        </motion.div>
    );
};
