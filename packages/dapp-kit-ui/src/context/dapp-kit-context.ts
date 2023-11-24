import { createContext } from '@lit/context';

type DappKitContext = {
    address: string;
};

const dappKitContext = createContext<DappKitContext>(
    Symbol('dapp-kit-context'),
);

export { dappKitContext, type DappKitContext };
