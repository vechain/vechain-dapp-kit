'use client';

import { Modal, ModalContent, ModalOverlay } from '@chakra-ui/react';
import { useWallet } from '../../../hooks';
import { getPicassoImage } from '../../../utils';
import { useState, useEffect } from 'react';
import { SettingsContent } from './SettingsContent';
import { MainContent } from './MainContent';

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export const AccountModal = ({ isOpen, onClose }: Props) => {
    const { isConnectedWithPrivy, connectedAccount, smartAccount } =
        useWallet();

    const walletImage = getPicassoImage(
        isConnectedWithPrivy
            ? smartAccount.address ?? ''
            : connectedAccount ?? '',
    );

    const [currentContent, setCurrentContent] = useState<'main' | 'settings'>(
        'main',
    );
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
                        walletImage={walletImage}
                    />
                );
            case 'settings':
                return (
                    <SettingsContent
                        setCurrentContent={setCurrentContent}
                        walletImage={walletImage}
                    />
                );
        }
    };

    return (
        <Modal
            motionPreset="slideInBottom"
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
