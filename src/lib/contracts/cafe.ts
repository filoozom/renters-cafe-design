import { Contract } from "@ethersproject/contracts";

import abi from "../../data/abis/cafe.json";
import config from "../../../config/default";
import { getSigner } from "../ethereum";

const { address } = config.cafe;

export const Cafe = async () => {
  const signer = getSigner();
  const contract = new Contract(address, abi, signer);

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
    address,
    contract,
    deposit,
    withdraw,
    harvest,
  };
};
