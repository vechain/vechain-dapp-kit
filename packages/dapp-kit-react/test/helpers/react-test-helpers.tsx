import {
    ConnectWalletButtonWithModal,
    ConnectWalletModal,
    DAppKitProvider,
    SelectWalletModal,
} from '../../src';

export const wrapper = ({ children }: { children?: React.ReactNode }) => (
    <DAppKitProvider nodeUrl="https://testnet.vechain.org">
        {children}
        <ConnectWalletButtonWithModal />
        <SelectWalletModal isOpen={false} />
        <ConnectWalletModal isOpen={false} />
    </DAppKitProvider>
);
