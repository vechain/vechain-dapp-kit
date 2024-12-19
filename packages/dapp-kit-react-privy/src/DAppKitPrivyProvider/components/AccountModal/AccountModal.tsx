'use client';

import {
    Modal,
    ModalContent,
    ModalContentProps,
    ModalOverlay,
    useMediaQuery,
} from '@chakra-ui/react';
import { useWallet } from '../../hooks';
import { getPicassoImage } from '../../utils';
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
          };

    const { isConnectedWithPrivy, connectedAccount, smartAccount } =
        useWallet();

    const walletImage = getPicassoImage(
        isConnectedWithPrivy
            ? smartAccount.address ?? ''
            : connectedAccount ?? '',
    );

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
                        walletImage={walletImage}
                    />
                );
            case 'settings':
                return (
                    <WalletSettingsContent
                        setCurrentContent={setCurrentContent}
                        walletImage={walletImage}
                    />
                );
            case 'smart-account':
                return (
                    <SmartAccountContent
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
            size="md"
        >
            <ModalOverlay />

            <ModalContent {...(_modalContentProps as ModalContentProps)}>
                {renderContent()}
            </ModalContent>
        </Modal>
    );
};
