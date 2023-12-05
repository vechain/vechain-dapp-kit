import {
    ConnectWalletModal,
    DAppKitProvider,
    SelectWalletModal,
    VechainDappConnectKit,
    ConnectWalletButtonWithModal,
} from '../../src';
import { ThemeProvider } from '../../src/provider/ThemeProvider';

export const wrapper = ({ children }: { children?: React.ReactNode }) => (
    <DAppKitProvider nodeUrl="https://testnet.vechain.org">
        <ThemeProvider>
            {children}
            <VechainDappConnectKit />
            <ConnectWalletButtonWithModal />
            <SelectWalletModal isOpen={false} />
            <ConnectWalletModal isOpen={false} />
        </ThemeProvider>
    </DAppKitProvider>
);
