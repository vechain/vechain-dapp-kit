"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  usePrivy,
  useWallets,
  type ConnectedWallet,
} from "@privy-io/react-auth";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { encodeFunctionData } from "viem";
import { ABIContract, Address, Clause } from "@vechain/sdk-core";
import {
  ThorClient,
  VeChainProvider,
  ProviderInternalBaseWallet,
  signerUtils,
} from "@vechain/sdk-network";
import { TransactionData } from "./useSendAccountAbstractedTransaction";
import { SimpleAccountABI, SimpleAccountFactoryABI } from "../assets/abi";

export interface SmartAccountContextType {
  address: string | undefined;
  embeddedWallet: ConnectedWallet | undefined;
  sendTransaction: (tx: {
    txClauses: TransactionData[];
    title?: string;
    description?: string;
    buttonText?: string;
  }) => Promise<string>;
  exportWallet: () => Promise<void>;
  thor: ThorClient;
  nodeUrl: string;
  delegatorUrl: string;
  accountFactory: string;
}

type SignData = {
  domain: {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: string;
  };
  types: {
    ExecuteWithAuthorization: {
      name: string;
      type: string;
    }[];
  };
  primaryType: string;
  message: {
    validAfter: number;
    validBefore: number;
    to: string | undefined;
    value: string;
    data: string;
  };
};

const randomTransactionUser = (() => {
  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);
  return {
    privateKey,
    account,
    address: account.address,
  };
})();

const VechainAccountContext = createContext<SmartAccountContextType | null>(
  null
);

export const SmartAccountProvider = ({
  children,
  nodeUrl,
  delegatorUrl,
  accountFactory,
}: {
  children: React.ReactNode;
  nodeUrl: string;
  delegatorUrl: string;
  accountFactory: string;
}) => {
  const { signTypedData, exportWallet } = usePrivy();
  const { wallets } = useWallets();
  const embeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === "privy"
  );
  const [address, setAddress] = useState<string | undefined>();
  const [chainId, setChainId] = useState("");
  const thor = ThorClient.fromUrl(nodeUrl);

  /**
   * load the address of the account abstraction wallet identified by the embedded wallets address
   * it is the origin for on-chain-interaction with other parties
   * */
  useEffect(() => {
    if (!embeddedWallet) {
      return;
    }

    thor.contracts
      .executeCall(
        accountFactory,
        ABIContract.ofAbi(SimpleAccountFactoryABI).getFunction("getAccountAddress"),
        [embeddedWallet.address]
      )
      .then((accountAddress) => setAddress(String(accountAddress.result.plain)))
      .catch(() => {
        /* ignore */
      });
  }, [embeddedWallet, thor, accountFactory]);

  /**
   * identify the current chain from its genesis block
   */
  useEffect(() => {
    thor.blocks
      .getGenesisBlock()
      .then(
        (genesis) => genesis?.id && setChainId(BigInt(genesis.id).toString())
      )
      .catch(() => {
        /* ignore */
      });
  }, [thor]);

  // reset address when embedded wallet vanishes
  useEffect(() => {
    if (!embeddedWallet) {
      setAddress(undefined);
    }
  }, [embeddedWallet]);

  const sendTransaction = async ({
    txClauses = [],
    title = "Sign Transaction",
    description,
    buttonText = "Sign",
  }: {
    txClauses: TransactionData[];
    title?: string;
    description?: string;
    buttonText?: string;
  }): Promise<string> => {
    if (!address || !embeddedWallet) {
      throw new Error("Address or embedded wallet is missing");
    }

    // build the object to be signed, containing all information & instructions
    const dataToSign: SignData[] = txClauses.map((txData) => ({
      domain: {
        name: "Wallet",
        version: "1",
        chainId: chainId as unknown as number, // work around the viem limitation that chainId must be a number but its too big to be handled as such
        verifyingContract: address,
      },
      types: {
        ExecuteWithAuthorization: [
          { name: "to", type: "address" },
          { name: "value", type: "uint256" },
          { name: "data", type: "bytes" },
          { name: "validAfter", type: "uint256" },
          { name: "validBefore", type: "uint256" },
        ],
      },
      primaryType: "ExecuteWithAuthorization",
      message: {
        validAfter: 0,
        validBefore: Math.floor(Date.now() / 1000) + 3600,
        to: txData.to,
        value: String(txData.value),
        data:
          typeof txData.data === "object" && "abi" in txData.data
            ? encodeFunctionData(txData.data)
            : txData.data,
      },
    }));

    // request signatures using privy
    const signatures: string[] = await Promise.all(
      dataToSign.map((data, index) => {
        const txClause = txClauses[index];
        if (!txClause) {
          throw new Error(`Transaction clause at index ${index} is undefined`);
        }
    
        const funcData = txClause.data;
        return signTypedData(data, {
          title,
          description:
            description ??
            (typeof funcData === "object" && "functionName" in funcData
              ? funcData.functionName
              : "Transaction"),
          buttonText,
        });
      })
    );    

    // start building the clauses for the transaction
    const clauses = [];

    // if the account address has no code yet, it's not been deployed/created yet
    const { hasCode: isDeployed } = await thor.accounts.getAccount(Address.of(address));
    if (!isDeployed) {
      clauses.push(
        Clause.callFunction(
          Address.of(accountFactory),
          ABIContract.ofAbi(SimpleAccountFactoryABI).getFunction("createAccount"), //inser ABI
          [embeddedWallet.address]
        )
        /*clauseBuilder.functionInteraction(
          accountFactory,
          "function createAccount(address owner)" as unknown as FunctionFragment,
          [embeddedWallet.address]
        ) OLD */
      );
    }

    dataToSign.forEach((data, index) => {
      clauses.push(
        Clause.callFunction(
          Address.of(address),
          ABIContract.ofAbi(SimpleAccountABI).getFunction("executeWithAuthorization"),
          [
            data.message.to as `0x${string}`,
            BigInt(data.message.value),
            data.message.data as `0x${string}`,
            BigInt(data.message.validAfter),
            BigInt(data.message.validBefore),
            signatures[index] as `0x${string}`,
          ]
        )
      );
    });

    // estimate the gas fees for the transaction
    const gasResult = await thor.gas.estimateGas(
      clauses,
      embeddedWallet.address,
      {
        gasPadding: 1,
      }
    );

    // build the transaction in VeChain format, with delegation enabled
    const txBody = await thor.transactions.buildTransactionBody(
      clauses,
      gasResult.totalGas,
      { isDelegated: true }
    );

    // sign the transaction and request the fee delegator to pay the gas fees in the process
    const wallet = new ProviderInternalBaseWallet(
      [
        {
          privateKey: Buffer.from(
            randomTransactionUser.privateKey.slice(2),
            "hex"
          ),
          address: randomTransactionUser.address,
        },
      ],
      { delegator: { delegatorUrl } }
    );
    const providerWithDelegationEnabled = new VeChainProvider(
      thor,
      wallet,
      true
    );
    const signer = await providerWithDelegationEnabled.getSigner(
      randomTransactionUser.address
    );
    const txInput = signerUtils.transactionBodyToTransactionRequestInput(
      txBody,
      randomTransactionUser.address
    );
    const rawDelegateSigned = await signer!.signTransaction(txInput);

    // publish the hexlified signed transaction directly on the node api
    const { id } = (await fetch(`${nodeUrl}/transactions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        raw: rawDelegateSigned,
      }),
    }).then((res) => res.json())) as { id: string };

    return id;
  };

  return (
    <VechainAccountContext.Provider
      value={{
        address,
        accountFactory,
        nodeUrl,
        delegatorUrl,
        embeddedWallet,
        sendTransaction,
        exportWallet,
        thor,
      }}
    >
      {children}
    </VechainAccountContext.Provider>
  );
};

export const useSmartAccount = () => {
  const context = useContext(VechainAccountContext);
  if (!context) {
    throw new Error(
      "useSmartAccount must be used within a SmartAccountProvider"
    );
  }
  return context;
};
