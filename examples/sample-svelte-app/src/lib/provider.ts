import type { DAppKit } from '@vechain/dapp-kit';
import type { DAppKitUIOptions } from '@vechain/dapp-kit-ui';
import { getContext, setContext } from 'svelte';

export type DappKitFunctionsContextProps = Required<
    Pick<DAppKitUIOptions['v2Api'], 'onConnectRequest' | 'onConnectResponse'>
> & {
    dappKit: DAppKit | null;
};

const key = '__DAPP_KIT_UI__';

export const setDappKitFunctionsContext = (
    value: DappKitFunctionsContextProps,
) => {
    setContext(key, value);
};

export const getDappKitFunctionsContext = () => {
    return getContext<DappKitFunctionsContextProps>(key);
};
