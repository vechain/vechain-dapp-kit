import { useCallback, useEffect, useMemo, useState } from "react";
import { useConnex } from "react-vendor";
import type { abi } from "thor-devkit";

const _counter: abi.Function.Definition = {
  inputs: [],
  name: "counter",
  outputs: [
    {
      internalType: "uint256",
      name: "count",
      type: "uint256",
    },
  ],
  stateMutability: "view",
  type: "function",
};

const _increment: abi.Function.Definition = {
  inputs: [],
  name: "increment",
  outputs: [],
  stateMutability: "nonpayable",
  type: "function",
};

type IncrementStatus = "idle" | "in-wallet" | "pending" | "error";

interface UseCounter {
  count: number;
  increment: () => Promise<void>;
  status: IncrementStatus;
  address: string;
}

export const useCounter = (): UseCounter => {
  const { vendor, thor } = useConnex();

  const [count, setCount] = useState<number>(0);
  const [status, setStatus] = useState<IncrementStatus>("idle");

  const contract = useMemo(
    () => thor.account("0x8384738c995d49c5b692560ae688fc8b51af1059"),
    [thor]
  );

  const setValue = useCallback(async () => {
    const res = await contract.method(_counter).call();

    setCount(res.decoded.count as number);
  }, [contract]);

  useEffect(() => {
    setValue().catch(() => setStatus("error"));
  }, [setValue]);

  const increment = useCallback(async (): Promise<void> => {
    const clause = contract.method(_increment).asClause();

    setStatus("in-wallet");

    await vendor
      .sign("tx", [clause])
      .delegate("https://sponsor-testnet.vechain.energy/by/90")
      .request();

    setStatus("pending");

    await thor.ticker().next();

    await setValue()
      .then(() => setStatus("idle"))
      .catch(() => setStatus("error"));
  }, [thor, vendor, contract, setValue]);

  return { count, increment, status, address: contract.address };
};
