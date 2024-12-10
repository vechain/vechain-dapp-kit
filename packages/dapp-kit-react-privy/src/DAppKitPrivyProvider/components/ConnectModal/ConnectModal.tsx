'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useWalletModal } from '@vechain/dapp-kit-react';
import { TwitterLogo } from '../TwitterLogo';
import { GoogleLogo } from '../GoogleLogo';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    logo?: string;
};

export const ConnectModal = ({ isOpen, onClose, logo }: Props) => {
    const { login } = usePrivy();

    const { open } = useWalletModal();

    return isOpen ? (
        <div
            className="connect-modal-overlay"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                zIndex: 1000,
            }}
            onClick={onClose}
        >
            <div
                className="connect-modal-container"
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'white',
                    width: '90%',
                    maxWidth: '400px',
                    padding: '20px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="connect-modal-close"
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                    }}
                    onClick={onClose}
                >
                    ✕
                </button>
                <h3
                    className="connect-modal-title"
                    style={{
                        fontSize: '18px',
                        fontWeight: '500',
                        textAlign: 'center',
                        marginBottom: '20px',
                    }}
                >
                    Log in or sign up
                </h3>
                <div
                    className="connect-modal-logo"
                    style={{ textAlign: 'center', marginBottom: '20px' }}
                >
                    <img
                        src={logo || '/images/favicon.png'}
                        alt="logo"
                        style={{ maxWidth: '180px', maxHeight: '90px' }}
                    />
                </div>
                <p
                    className="connect-modal-text"
                    style={{
                        fontSize: '14px',
                        color: '#555',
                        textAlign: 'center',
                        marginBottom: '20px',
                    }}
                >
                    Select a login method
                </p>
                <div className="connect-modal-buttons">
                    <button
                        className="connect-modal-social"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            padding: '10px',
                            marginBottom: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '6px',
                            backgroundColor: 'white',
                            cursor: 'pointer',
                        }}
                        onClick={() => {
                            onClose();
                            login();
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginRight: '10px',
                            }}
                        >
                            <TwitterLogo isDark={false} />
                            <GoogleLogo />
                        </div>
                        <span>Continue with Social</span>
                    </button>
                    <button
                        className="connect-modal-wallet"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            padding: '10px',
                            border: 'none',
                            background: 'none',
                            color: '#555',
                            cursor: 'pointer',
                        }}
                        onClick={() => {
                            onClose();
                            open();
                        }}
                    >
                        <span>or with Crypto Wallet</span>
                    </button>
                </div>
            </div>
        </div>
    ) : null;
};
