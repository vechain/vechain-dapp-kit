import {
    ConnectWalletButtonWithModal,
    ConnectWalletModal,
    DAppKitProvider,
    SelectWalletModal,
} from '../../src';
import { ThemeProvider } from '../../src/provider/ThemeProvider';

export const wrapper = ({ children }: { children?: React.ReactNode }) => (
    <DAppKitProvider nodeUrl="https://testnet.vechain.org">
        <ThemeProvider>
            {children}
            <ConnectWalletButtonWithModal />
            <SelectWalletModal isOpen={false} />
            <ConnectWalletModal isOpen={false} />
        </ThemeProvider>
    </DAppKitProvider>
);
