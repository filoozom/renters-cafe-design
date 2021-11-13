import { providers, Contract } from "ethers";
import type { Signer } from "ethers";

import abi from "../data/abis/cafe.json";
import { cleanOutput, toBigNumber } from "./ethereum";
import config from "../../config/default";
import type { Pool } from "../types/pool";
import { LP } from "./lp";

const provider = new providers.JsonRpcProvider(config.rpc);
const getContract = (signer: Signer | providers.Provider = provider) =>
  new Contract(config.cafe.address, abi, signer);

export const Cafe = async () => {
  /*
  const { ethereum } = window;
  const provider = new providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  */

  const getPools = async (): Promise<Pool[]> => {
    const contract = getContract();
    const count = await contract.poolLength();
    return await Promise.all(
      Array.from({ length: count }, (_, i) => i).map(async (id) => {
        const pool = cleanOutput(await contract.pools(id));
        const lp = await LP(pool.token);
        const [type, tokens] = await Promise.all([
          lp.getType(),
          lp.getTokens(),
        ]);

        return {
          id,
          ...pool,
          lp: { type, tokens },
        };
      })
    );
  };

  const getRentPerSeconds = async (): Promise<bigint> => {
    const contract = getContract();
    return toBigNumber(await contract.rentPerBlock());
  };

  const getTotalAllocation = async (): Promise<bigint> => {
    const contract = getContract();
    return toBigNumber(await contract.rentPerBlock());
  };

  return {
    getContract,
    getPools,
    getRentPerSeconds,
    getTotalAllocation,
  };
};
