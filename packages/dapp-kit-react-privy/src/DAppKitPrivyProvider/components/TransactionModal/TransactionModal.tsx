import { ReactNode, useMemo } from 'react';
import { ConfirmationModalContent } from './ConfirmationModalContent';
import { ErrorModalContent } from './ErrorModalContent';
import { LoadingModalContent } from './LoadingModalContent';
import { SuccessModalContent } from './SuccessModalContent';
import { Modal, ModalOverlay } from '@chakra-ui/react';
import { CustomModalContent } from './CustomModalContent';

export type TransactionModalProps = {
    isOpen: boolean;
    onClose: () => void;
    status: string;
    pendingTitle?: ReactNode;
    confirmationTitle?: ReactNode;
    errorTitle?: ReactNode;
    errorDescription?: string;
    successTitle?: ReactNode;
    showSocialButtons?: boolean;
    socialDescriptionEncoded?: string;
    showTryAgainButton?: boolean;
    onTryAgain?: () => void;
    showExplorerButton?: boolean;
    txId?: string;
};

export const TransactionModal = ({
    isOpen,
    onClose,
    status,
    pendingTitle,
    confirmationTitle,
    errorTitle,
    errorDescription,
    successTitle,
    showSocialButtons = false,
    socialDescriptionEncoded,
    showTryAgainButton,
    onTryAgain,
    showExplorerButton,
    txId,
}: TransactionModalProps) => {
    const modalContent = useMemo(() => {
        if (status === 'pending')
            return <ConfirmationModalContent title={confirmationTitle} />;
        if (status === 'waitingConfirmation')
            return (
                <LoadingModalContent
                    title={pendingTitle}
                    showExplorerButton={showExplorerButton}
                    txId={txId}
                />
            );
        if (status === 'error')
            return (
                <ErrorModalContent
                    title={errorTitle}
                    description={errorDescription}
                    showTryAgainButton={showTryAgainButton}
                    onTryAgain={onTryAgain}
                    showExplorerButton={showExplorerButton}
                    txId={txId}
                />
            );
        if (status === 'success')
            return (
                <SuccessModalContent
                    title={successTitle}
                    showSocialButtons={showSocialButtons}
                    socialDescriptionEncoded={socialDescriptionEncoded}
                    showExplorerButton={showExplorerButton}
                    txId={txId}
                />
            );
        return null;
    }, [
        status,
        confirmationTitle,
        pendingTitle,
        showExplorerButton,
        txId,
        errorTitle,
        errorDescription,
        showTryAgainButton,
        onTryAgain,
        successTitle,
        showSocialButtons,
        socialDescriptionEncoded,
    ]);
    if (!modalContent) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            trapFocus={false}
            closeOnOverlayClick={status !== 'pending'}
            isCentered={true}
        >
            <ModalOverlay />
            <CustomModalContent>{modalContent}</CustomModalContent>
        </Modal>
    );
};
