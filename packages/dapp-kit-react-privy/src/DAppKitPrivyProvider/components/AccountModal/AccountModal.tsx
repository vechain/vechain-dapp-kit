'use client';

import {
    Modal,
    ModalContent,
    ModalContentProps,
    ModalOverlay,
    useMediaQuery,
} from '@chakra-ui/react';
import { useWallet } from '../../hooks';
import { useState, useEffect } from 'react';
import { WalletSettingsContent } from './WalletSettingsContent';
import { AccountModalMainContent } from './AccountModalMainContent';
import { SmartAccountContent } from './SmartAccountContent';
type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export type AccountModalContentTypes = 'main' | 'settings' | 'smart-account';

export const AccountModal = ({ isOpen, onClose }: Props) => {
    const [isDesktop] = useMediaQuery('(min-width: 768px)');
    const _modalContentProps = isDesktop
        ? {}
        : {
              position: 'fixed',
              bottom: '0',
              mb: '0',
              maxW: '2xl',
              borderRadius: '24px 24px 0px 0px',
              overflowY: 'scroll',
              overflowX: 'hidden',
          };

    const { selectedAccount } = useWallet();

    const [currentContent, setCurrentContent] =
        useState<AccountModalContentTypes>('main');
    useEffect(() => {
        if (isOpen) {
            setCurrentContent('main');
        }
    }, [isOpen]);

    const renderContent = () => {
        switch (currentContent) {
            case 'main':
                return (
                    <AccountModalMainContent
                        setCurrentContent={setCurrentContent}
                        onClose={onClose}
                        walletImage={selectedAccount.image}
                    />
                );
            case 'settings':
                return (
                    <WalletSettingsContent
                        setCurrentContent={setCurrentContent}
                    />
                );
            case 'smart-account':
                return (
                    <SmartAccountContent
                        setCurrentContent={setCurrentContent}
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
            size="md"
            scrollBehavior="inside"
        >
            <ModalOverlay />

            <ModalContent {...(_modalContentProps as ModalContentProps)}>
                {renderContent()}
            </ModalContent>
        </Modal>
    );
};
