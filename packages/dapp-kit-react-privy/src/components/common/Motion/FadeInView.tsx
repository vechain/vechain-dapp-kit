import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type Props = {
    children: ReactNode;
};

export const FadeInView = ({ children }: Props) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, easing: [0.17, 0.55, 0.55, 1] }}
        >
            {children}
        </motion.div>
    );
};
