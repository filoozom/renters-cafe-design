import { providers, Contract } from "ethers";
import type { Signer } from "ethers";

import abi from "../data/abis/lp.json";
import config from "../../config/default";
import type { LP as LPType } from "../types/lp";
import { ERC20 } from "./erc20";

const provider = new providers.JsonRpcProvider(config.rpc);

export const LP = async (address: string) => {
  const getContract = (signer: Signer | providers.Provider = provider) =>
    new Contract(address, abi, signer);

  const getTokens = async (): Promise<LPType["tokens"]> => {
    const contract = getContract();
    const addresses = await Promise.all([contract.token0(), contract.token1()]);
    return await Promise.all(
      addresses.map(async (address) => ({
        address,
        symbol: await (await ERC20(address)).getSymbol(),
      }))
    );
  };

  const getType = async (): Promise<LPType["type"]> => {
    const contract = getContract();
    const name: keyof typeof config.lps.nameToType = await contract.name();
    return config.lps.nameToType[name] || "Unknown";
  };

  const getAll = async (): Promise<LPType> => {
    const [tokens, type] = await Promise.all([getTokens(), getType()]);
    return { tokens, type };
  };

  return {
    getContract,
    getTokens,
    getType,
    getAll,
  };
};
