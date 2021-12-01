import { Contract } from "@ethersproject/contracts";
import type { BigNumber } from "@ethersproject/bignumber";

import abi from "../../data/abis/cafe.json";
import config from "../../../config/default";
import { getSigner } from "../ethereum";

const { address } = config.cafe;

export const Cafe = async () => {
  const signer = getSigner();
  const contract = new Contract(address, abi, signer);

  const deposit = async (poolId: BigNumber, amount: BigNumber) => {
    await contract.deposit(poolId, amount);
  };

  const withdraw = async (poolId: BigNumber, amount: BigNumber) => {
    await contract.withdraw(poolId, amount);
  };

  const harvest = async (poolId: BigNumber) => {
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
