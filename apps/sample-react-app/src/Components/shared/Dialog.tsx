import type { HTMLChakraProps } from '@chakra-ui/react';
import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay
} from '@chakra-ui/react';
import React from 'react';

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    header?: React.ReactNode;
    headerStyle?: HTMLChakraProps<'header'>;
    body?: React.ReactNode;
    footer?: React.ReactNode;
    showCloseButton?: boolean;
    closeButtonStyle?: HTMLChakraProps<'button'>;
}

export const Dialog: React.FC<DialogProps> = ({
    isOpen,
    onClose,
    header,
    headerStyle = {},
    body,
    footer,
    showCloseButton = true,
    closeButtonStyle = {}
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} trapFocus={false}>
            <ModalOverlay />
            <ModalContent>
                {header ? (
                    <ModalHeader {...headerStyle}>{header}</ModalHeader>
                ) : null}
                {showCloseButton ? (
                    <ModalCloseButton {...closeButtonStyle} />
                ) : null}
                {body ? <ModalBody>{body}</ModalBody> : null}
                {footer ? <ModalFooter>{footer}</ModalFooter> : null}
            </ModalContent>
        </Modal>
    );
};
