import { Contract } from "@ethersproject/contracts";
import type { BigNumber } from "@ethersproject/bignumber";

import abi from "../../data/abis/erc20.json";
import { getEthereum } from "../ethereum";

export const ERC20 = async (address: string) => {
  const { signer } = getEthereum();
  const contract = new Contract(address, abi, signer);

  const checkAllowance = async (spender: string, amount: BigNumber) => {
    const allowance: BigNumber = await contract.allowance(
      signer?.getAddress(),
      spender
    );
    return allowance.gt(amount);
  };

  const approve = async (address: string, amount: BigNumber) => {
    return contract.approve(address, amount);
  };

  return {
    contract,
    checkAllowance,
    approve,
  };
};
