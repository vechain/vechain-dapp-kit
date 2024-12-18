'use client';

import {
    Modal,
    ModalContent,
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

export const ConnectModal = ({ isOpen, onClose, logo }: Props) => {
    const [isDesktop] = useMediaQuery('(min-width: 768px)');
    const [currentContent, setCurrentContent] = useState<'main' | 'ecosystem'>(
        'main',
    );
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
            <ModalContent>{renderContent()}</ModalContent>
        </Modal>
    );
};
