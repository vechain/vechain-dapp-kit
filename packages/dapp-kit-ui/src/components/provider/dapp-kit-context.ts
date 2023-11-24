import { createContext } from '@lit/context';

type DappKitContext = {
    address: string;
};

const dappKitContext = createContext<DappKitContext>(
    Symbol('dapp-kit-context'),
);

const storeDappKitContext = function (context: DappKitContext) {
    localStorage.setItem('dapp-kit-context-object', JSON.stringify(context));
};

const getDappKitContext = function (): DappKitContext {
    const dappKitContextObject = localStorage.getItem(
        'dapp-kit-context-object',
    );

    if (!dappKitContextObject) {
        return {
            address: '',
        };
    }
    return JSON.parse(dappKitContextObject) as DappKitContext;
};

export {
    dappKitContext,
    type DappKitContext,
    storeDappKitContext,
    getDappKitContext,
};
