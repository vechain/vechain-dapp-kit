import { createContext } from '@lit/context';

interface DappKitContextOptions {
    notPersistentContext: boolean;
}

interface DappKitContext {
    options: DappKitContextOptions;
    address: string;
}

const dappKitContext = createContext<DappKitContext>(
    Symbol('dapp-kit-context'),
);

const storeDappKitContext = function (context: DappKitContext): void {
    localStorage.setItem('dapp-kit-context-object', JSON.stringify(context));
};

const getDappKitContext = function (
    notPersistentContext = false,
): DappKitContext {
    const dappKitContextObject = localStorage.getItem(
        'dapp-kit-context-object',
    );

    if (notPersistentContext || !dappKitContextObject) {
        return {
            options: {
                notPersistentContext,
            },
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
