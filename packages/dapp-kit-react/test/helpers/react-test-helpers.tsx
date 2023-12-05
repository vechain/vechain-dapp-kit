import { ConnectButtonWithModal, DAppKitProvider } from '../../src';
import { ThemeProvider } from '../../src/provider/ThemeProvider';

export const wrapper = ({ children }: { children?: React.ReactNode }) => (
    <DAppKitProvider nodeUrl="https://testnet.vechain.org">
        <ThemeProvider>
            {children}
            <ConnectButtonWithModal />
        </ThemeProvider>
    </DAppKitProvider>
);
