import { Contract } from "@ethersproject/contracts";

import abi from "../../data/abis/lp.json";
import config from "../../../config/default";
import type { LP as LPType } from "../../types/lp";
import { getSigner } from "../ethereum";

export const LP = async (address: string) => {
  const signer = getSigner();
  const contract = new Contract(address, abi, signer);

  const getBalance = async (
    address = config.cafe.address
  ): Promise<LPType["balance"]> => {
    return await contract.balanceOf(address);
  };

  return {
    contract,
    getBalance,
  };
};
