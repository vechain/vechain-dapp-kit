import { Box, HStack, Link } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaTelegramPlane } from 'react-icons/fa';
import { FaWhatsapp } from 'react-icons/fa6';
import { RiTwitterXFill } from 'react-icons/ri';
import React from 'react';

const TWITTER_INJECT = 'https://twitter.com/intent/tweet?text=';

const WHATSAPP_INJECT = 'https://wa.me/?text=';

const TELEGRAM_INJECT = 'https://telegram.me/share/url?url=';

// bouncing circle button animation provider
const BouncingAnimation = ({ children }: { children: React.ReactNode }) => (
    <motion.div
        whileHover={{ scale: 1.1 }}
        transition={{
            duration: 0.5,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatDelay:
                (crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32) * 5,
        }}
        animate={{
            y: [0, -2, 0],
            rotate: [0, 10, -10, 0],
        }}
    >
        {children}
    </motion.div>
);

type Props = {
    descriptionEncoded: string;
    url?: string;
    facebookHashtag?: string;
};

export const ShareButtons = ({ descriptionEncoded }: Props) => {
    return (
        <HStack gap={2}>
            <BouncingAnimation>
                <Link
                    href={`${TWITTER_INJECT}${descriptionEncoded}`}
                    isExternal
                >
                    <Box bg={'lightgrey'} p={2} borderRadius={'full'}>
                        <RiTwitterXFill size={22} />
                    </Box>
                </Link>
            </BouncingAnimation>
            <BouncingAnimation>
                <Link
                    href={`${TELEGRAM_INJECT}${descriptionEncoded}`}
                    isExternal
                >
                    <Box bg={'#30abec'} p={2} borderRadius={'full'}>
                        <FaTelegramPlane color="white" size={22} />
                    </Box>
                </Link>
            </BouncingAnimation>
            <BouncingAnimation>
                <Link
                    href={`${WHATSAPP_INJECT}${descriptionEncoded}`}
                    isExternal
                >
                    <Box bg={'#01cb37'} p={2} borderRadius={'full'}>
                        <FaWhatsapp size={22} color="white" />
                    </Box>
                </Link>
            </BouncingAnimation>
        </HStack>
    );
};
