import { useProvider } from '@vechain/dapp-kit-react';
import { Counter__factory } from '@vechain/hardhat-example';

const counterAddress = '0x8384738c995d49c5b692560ae688fc8b51af1059';

export const useCounter = () => {
    const provider = useProvider();

    return Counter__factory.connect(
        counterAddress,
        // TODO: Fix this hack
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        provider.getSignerSync() as unknown as any,
    );
};
