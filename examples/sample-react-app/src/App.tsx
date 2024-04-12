import {useThor, useWallet, useWalletModal, WalletButton} from '@vechain/dapp-kit-react';
import {useCallback, useEffect, useState} from 'react';
import {clauseBuilder} from "@vechain/sdk-core"
import {ExtendedClause} from "@vechain/dapp-kit"


const interfaceAbi = [
    {
        "inputs": [],
        "name": "counter",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "increment",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

const counterAddress = "0x8384738c995d49c5b692560ae688fc8b51af1059";


function App() {
    const thor = useThor();
    const {account, setSource, connect, requestTransaction} = useWallet();
    const { open, onConnectionStatusChange } = useWalletModal();
    const [buttonText, setButtonText] = useState('Connect Custom Button');

    useEffect(() => {
        const handleConnected = (address: string | null) => {
            if (address) {
                const formattedAddress = `${address.slice(
                    0,
                    6,
                )}...${address.slice(-4)}`;
                setButtonText(`Disconnect from ${formattedAddress}`);
            } else {
                setButtonText('Connect Custom Button');
            }
        };

        handleConnected(account);

        onConnectionStatusChange(handleConnected);
    }, [account, onConnectionStatusChange]);

    /**
     * TODO: DApp Kit and SDK are not playing nice with other here, we should be ablo load the contract and do "contract.transact.increment()"
     * But instead we have to use various functions from each. How can we improve it?
     */
    const sendCustomTx = useCallback(async () => {
        if (account) {

            /**
             * Why can't we do:
             * const contract = thor.contracts.load(counterAddress, interfaceAbi);
             * const tx = await contract.increment()
             */

            const contract = thor.contracts.load(counterAddress, interfaceAbi);
            const fragment = contract.getFunctionFragment("increment")

            const clause = clauseBuilder.functionInteraction(contract.address, fragment, [], 0)

            const extendedClause: ExtendedClause = {
                ...clause,
                comment: "Increment counter",
                abi: fragment.format("json")
            }

            const walletResponse = await requestTransaction([extendedClause,extendedClause,extendedClause,extendedClause]);

            console.log(walletResponse);

            const receipt = await thor.transactions.waitForTransaction(walletResponse.txid);

            console.log(receipt);
        }
    }, [
        account,
        thor,
        requestTransaction
    ])

    const connectWithVeworld = useCallback(() => {
        setSource('veworld');
        connect();
    }, [setSource, connect]);

    const connectWithWalletConnect = useCallback(() => {
        setSource('wallet-connect');
        connect();
    }, [setSource, connect]);

    const connectWithSync2 = useCallback(() => {
        setSource('sync2');
        connect();
    }, [setSource, connect]);

    return (
      <div className="container v-stack">
          <h2>React JS</h2>
          <div className="label">kit button:</div>
          <WalletButton/>
          <div className="label">custom kit button:</div>
          <button className="custom" onClick={open}>
              {buttonText}
          </button>
          {account ? (
            <div className="v-stack">
                <div className="label">Send counter transaction:</div>
                <button className="custom" onClick={sendCustomTx}>
                    Send Custom transaction
                </button>
            </div>
          ) : (
            <div className="v-stack">
                <div className="label">Connect without modal:</div>
                <button className="custom" onClick={connectWithVeworld}>
                    Connect with veworld
                </button>
                <button
                  className="custom"
                  onClick={connectWithWalletConnect}
                >
                    Connect with wallet connect
                </button>
                <button className="custom" onClick={connectWithSync2}>
                    Connect with sync 2
                </button>
            </div>
          )}
      </div>
    );
}

export default App;
