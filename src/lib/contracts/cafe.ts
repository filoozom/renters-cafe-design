import { Contract } from "ethers";

import abi from "../../data/abis/cafe.json";
import config from "../../../config/default";
import { getSigner } from "../ethereum";

export const Cafe = async () => {
  const signer = getSigner();
  const contract = new Contract(config.cafe.address, abi, signer);

  const deposit = async (poolId: bigint, amount: bigint) => {
    await contract.deposit(poolId, amount);
  };

  const withdraw = async (poolId: bigint, amount: bigint) => {
    await contract.withdraw(poolId, amount);
  };

  const harvest = async (poolId: bigint) => {
    await contract.harvest(poolId);
  };

  return {
    contract,
    deposit,
    withdraw,
    harvest,
  };
};
