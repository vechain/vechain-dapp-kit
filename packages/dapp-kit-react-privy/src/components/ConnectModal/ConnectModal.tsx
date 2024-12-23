'use client';

import {
    Modal,
    ModalContent,
    ModalContentProps,
    ModalOverlay,
    useMediaQuery,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { MainContent } from './MainContent';
import { EcosystemContent } from './EcosystemContent';
import { PrivyAppInfo } from '../../utils';

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
    const [appsInfo, setAppsInfo] = useState<Record<string, PrivyAppInfo>>();

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
                        setAppsInfo={setAppsInfo}
                    />
                );
            case 'ecosystem':
                return (
                    <EcosystemContent
                        setCurrentContent={setCurrentContent}
                        onClose={onClose}
                        appsInfo={appsInfo}
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
        >
            <ModalOverlay />
            <ModalContent {...(_modalContentProps as ModalContentProps)}>
                {renderContent()}
            </ModalContent>
        </Modal>
    );
};
