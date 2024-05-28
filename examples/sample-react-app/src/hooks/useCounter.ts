import { useProvider } from '@vechain/dapp-kit-react';
import { useMemo } from 'react';
import { Counter__factory } from '@vechain/hardhat-example';

const counterAddress = '0x8384738c995d49c5b692560ae688fc8b51af1059';

export const useCounter = () => {
    const provider = useProvider();
    const signer = useMemo(() => {
        return provider.getSignerSync();
    }, [provider]);

    return Counter__factory.connect(counterAddress, signer);
};
