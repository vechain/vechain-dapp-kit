import { WalletButton, DAppKitProvider } from '../../src';

export const wrapper = ({ children }: { children?: React.ReactNode }) => (
    <DAppKitProvider nodeUrl="https://testnet.vechain.org" logLevel={'DEBUG'}>
        {children}
        <WalletButton />
    </DAppKitProvider>
);
