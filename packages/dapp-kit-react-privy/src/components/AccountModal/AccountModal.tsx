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
import {
    MainContent,
    WalletSettingsContent,
    SmartAccountContent,
} from './Contents';
import { AccountsContent } from './Contents';

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export type AccountModalContentTypes =
    | 'main'
    | 'settings'
    | 'smart-account'
    | 'accounts';

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
                    <MainContent
                        setCurrentContent={setCurrentContent}
                        onClose={onClose}
                        wallet={selectedAccount}
                    />
                );
            case 'settings':
                return (
                    <WalletSettingsContent
                        setCurrentContent={setCurrentContent}
                        onLogoutSuccess={onClose}
                    />
                );
            case 'smart-account':
                return (
                    <SmartAccountContent
                        setCurrentContent={setCurrentContent}
                    />
                );
            case 'accounts':
                return (
                    <AccountsContent
                        setCurrentContent={setCurrentContent}
                        onClose={onClose}
                        wallet={selectedAccount}
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
            size="sm"
            scrollBehavior="inside"
            trapFocus={false}
            autoFocus={false}
        >
            <ModalOverlay />

            <ModalContent {...(_modalContentProps as ModalContentProps)}>
                {renderContent()}
            </ModalContent>
        </Modal>
    );
};
