import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { WalletList } from './WalletList';
import { MdClose } from 'react-icons/md';

interface ModalProps {
    show: boolean;
    handleClose: () => void;
}

const ModalBackdropDiv = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
`;

const ModalDiv = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 420px;
    color: ${(props) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return props.theme.textColor;
    }};
    background-color: ${(props) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return props.theme.backgroundColor;
    }};
    z-index: 1010;
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
    padding: 20px 25px 30px 25px;
    border-radius: 12px;
    font-family: 'Inter';
    font-weight: 500;
    @media (max-width: 1024px) {
        top: auto;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        border-radius: 0;
        border-top-left-radius: 18px;
        border-top-right-radius: 18px;
        transform: translate(0%, 0%);
    }
`;

const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: 100%;
`;

const ModalTitle = styled.h5`
    font-size: 1.2rem;
`;

const ModalHeader = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0 5px 0;
`;

const ModalBody = styled.div`
    display: flex;
    flex-direction: column;
`;

const CloseIcon = styled(MdClose)`
    font-size: 1.3rem;
    cursor: pointer;
`;

const WalletModal = ({ show, handleClose }: ModalProps) => {
    const [isOpen, setIsOpen] = useState(show);

    const handleCloseModal = () => {
        setIsOpen(false);
        handleClose();
    };

    useEffect(() => {
        setIsOpen(show);
    }, [show]);

    return (
        isOpen && (
            <ModalBackdropDiv className="modal-backdrop">
                <ModalDiv className="modal">
                    <ModalContent>
                        <ModalHeader className="modal-header">
                            <ModalTitle className="modal-title">
                                Connect Wallet
                            </ModalTitle>
                            <CloseIcon onClick={handleCloseModal} />
                        </ModalHeader>
                        <ModalBody>
                            <WalletList />
                        </ModalBody>
                    </ModalContent>
                </ModalDiv>
            </ModalBackdropDiv>
        )
    );
};

export { WalletModal };
