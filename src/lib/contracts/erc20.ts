import { Contract, BigNumber } from "ethers";

import abi from "../../data/abis/erc20.json";
import config from "../../../config/default";
import { getSigner, toBigInt } from "../ethereum";

export const ERC20 = async (address: string) => {
  const signer = getSigner();
  const contract = new Contract(address, abi, signer);

  const checkAllowance = async (spender: string, amount: bigint) => {
    const allowance: BigNumber = await contract.allowance(
      signer.getAddress(),
      spender
    );
    return toBigInt(allowance) > amount;
  };

  const approve = async (address: string, amount: bigint) => {
    return contract.approve(address, amount);
  };

  return {
    contract,
    checkAllowance,
    approve,
  };
};
