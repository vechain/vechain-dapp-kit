'use client';
import {
    DAppKitProvider,
    DAppKitUIOptions,
    WalletConnectOptions,
} from '@vechain/dapp-kit-react';
import {
    createContext,
    createRef,
    PropsWithChildren,
    RefObject,
    useCallback,
    useContext,
    useMemo,
    useRef,
} from 'react';

const walletConnectOptions: WalletConnectOptions = {
    projectId: 'a0b855ceaf109dbc8426479a4c3d38d8',
    metadata: {
        name: 'Sample VeChain dApp',
        description: 'A sample VeChain dApp',
        url: typeof window !== 'undefined' ? window.location.origin : '',
        icons: [
            typeof window !== 'undefined'
                ? `${window.location.origin}/images/logo/my-dapp.png`
                : '',
        ],
    },
};

type OnConnectRequest = NonNullable<
    DAppKitUIOptions['v2Api']['onConnectRequest']
>;
type OnConnectResponse = NonNullable<
    DAppKitUIOptions['v2Api']['onConnectResponse']
>;

type ContextProps = {
    onConnectRequest: RefObject<OnConnectRequest | null>;
    onConnectResponse: RefObject<OnConnectResponse | null>;
};

//This context has been created only for display purposes. It's not needed to created something like this
const FunctionContext = createContext<ContextProps>({
    onConnectRequest: createRef(),
    onConnectResponse: createRef(),
});

export const Provider = ({ children }: PropsWithChildren) => {
    const onConnectRequestRef = useRef<OnConnectRequest>(null);
    const onConnectResponseRef = useRef<OnConnectResponse>(null);

    const ctxValue = useMemo(
        () => ({
            onConnectRequest: onConnectRequestRef,
            onConnectResponse: onConnectResponseRef,
        }),
        [],
    );

    const onConnectRequest = useCallback<OnConnectRequest>((source) => {
        if (onConnectRequestRef.current)
            return onConnectRequestRef.current(source);
        return Promise.resolve(null);
    }, []);

    const onConnectResponse = useCallback<OnConnectResponse>(
        (source, value) => {
            if (onConnectResponseRef.current)
                return onConnectResponseRef.current(source, value);
            alert(JSON.stringify(value));
            return Promise.resolve();
        },
        [],
    );

    return (
        <FunctionContext.Provider value={ctxValue}>
            <DAppKitProvider
                node={'https://testnet.vechain.org'}
                usePersistence
                walletConnectOptions={walletConnectOptions}
                logLevel={'DEBUG'}
                v2Api={{ enabled: true, onConnectRequest, onConnectResponse }}
            >
                {children}
            </DAppKitProvider>
        </FunctionContext.Provider>
    );
};

export const useDappKitFunctions = () => useContext(FunctionContext);
