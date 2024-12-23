'use client';

import {
    Modal,
    ModalContent,
    ModalContentProps,
    ModalOverlay,
    useMediaQuery,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { MainContent } from './Contents/MainContent';
import { EcosystemContent } from './Contents/EcosystemContent';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    logo?: string;
};

export type ConnectModalContents = 'main' | 'ecosystem' | 'email-verification';

export const ConnectModal = ({ isOpen, onClose, logo }: Props) => {
    const [isDesktop] = useMediaQuery('(min-width: 768px)');
    const _modalContentProps = isDesktop
        ? {}
        : {
              position: 'fixed',
              bottom: '0px',
              mb: '0',
              maxW: '2xl',
              borderRadius: '24px 24px 0px 0px',
              overflowY: 'scroll',
              overflowX: 'hidden',
          };
    const [currentContent, setCurrentContent] =
        useState<ConnectModalContents>('main');

    useEffect(() => {
        if (isOpen) {
            setCurrentContent('main');
        }
    }, [isOpen]);

    const renderContent = () => {
        switch (currentContent) {
            case 'main':
                return (
                    <MainContent
                        setCurrentContent={setCurrentContent}
                        onClose={onClose}
                        logo={logo}
                    />
                );
            case 'ecosystem':
                return (
                    <EcosystemContent
                        setCurrentContent={setCurrentContent}
                        onClose={onClose}
                    />
                );
        }
    };

    return (
        <Modal
            motionPreset={isDesktop ? 'none' : 'slideInBottom'}
            isOpen={isOpen}
            onClose={onClose}
            isCentered
            size={'sm'}
            trapFocus={false}
        >
            <ModalOverlay />
            <ModalContent {...(_modalContentProps as ModalContentProps)}>
                {renderContent()}
            </ModalContent>
        </Modal>
    );
};
