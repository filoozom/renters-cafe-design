import { providers, Contract } from "ethers";
import type { Signer } from "ethers";

import abi from "../data/abis/erc20.json";
import config from "../../config/default";
import type { ERC20 as ERC20Type } from "../types/erc20";

const provider = new providers.JsonRpcProvider(config.rpc);

export const ERC20 = async (address: string) => {
  const getContract = (signer: Signer | providers.Provider = provider) =>
    new Contract(address, abi, signer);

  const getName = async (): Promise<ERC20Type["name"]> => {
    const contract = getContract();
    return await contract.name();
  };

  const getSymbol = async (): Promise<ERC20Type["symbol"]> => {
    const contract = getContract();
    return await contract.symbol();
  };

  const getAll = async (): Promise<ERC20Type> => {
    const [name, symbol] = await Promise.all([getName(), getSymbol()]);
    return { name, symbol };
  };

  return {
    getContract,
    getName,
    getSymbol,
    getAll,
  };
};
