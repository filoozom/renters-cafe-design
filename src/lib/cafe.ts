import { Contract } from "ethers";

import abi from "../data/abis/cafe.json";
import config from "../../config/default";
import { getSigner } from "./ethereum";

export const Cafe = async () => {
  const signer = getSigner();
  const contract = new Contract(config.cafe.address, abi, signer);

  const deposit = async (poolId: bigint, amount: bigint): Promise<void> => {
    await contract.deposit(poolId, amount);
  };

  return {
    contract,
    deposit,
  };
};
