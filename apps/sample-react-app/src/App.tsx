import type { JSX } from 'react';
import React from 'react';
import type { Options } from '@vechain/connex';
import type { WalletConnectOptions } from '@vechain/wallet-connect';
import { ConnexProvider } from '@vechain/react-wallet-kit';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { NavBar, StyledContainer } from './Components/layout';
import { Homepage } from './Screens/Homepage';
import { Fonts, theme } from './Styles';

const nodeOptions: Omit<Options, 'signer'> = {
    node: 'https://testnet.vechain.org/',
    network: 'test',
};

const walletConnectOptions: WalletConnectOptions = {
    projectId: 'a0b855ceaf109dbc8426479a4c3d38d8',
    metadata: {
        name: 'Sample VeChain dApp',
        description: 'A sample VeChain dApp',
        url: window.location.origin,
        icons: [`${window.location.origin}/images/logo/my-dapp.png`],
    },
};

export const App = (): JSX.Element => {
    return (
        <>
            <Fonts />
            <ChakraProvider theme={theme}>
                <ConnexProvider
                    key="connex"
                    nodeOptions={nodeOptions}
                    persistState
                    walletConnectOptions={walletConnectOptions}
                >
                    <NavBar />
                    <StyledContainer>
                        <BrowserRouter
                            basename={
                                process.env.NODE_ENV === 'production'
                                    ? '/vechain-dapp-kit/react'
                                    : '/'
                            }
                        >
                            <Routes>
                                <Route element={<Homepage />} path="/" />
                            </Routes>
                        </BrowserRouter>
                    </StyledContainer>
                </ConnexProvider>
            </ChakraProvider>
        </>
    );
};
