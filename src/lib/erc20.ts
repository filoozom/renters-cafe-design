import { providers, Contract } from "ethers";

import abi from "../data/abis/erc20.json";
import config from "../../config/default";
import { getSigner } from "./ethereum";

const provider = new providers.JsonRpcProvider(config.rpc);

export const ERC20 = async (address: string) => {
  const signer = getSigner();
  const contract = new Contract(address, abi, signer);

  const checkAllowance = async (amount: bigint) => {
    const allowance: bigint = await contract.allowance(
      signer.getAddress(),
      config.cafe.address
    );
    return allowance > amount;
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
