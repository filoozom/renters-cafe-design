import { Contract } from "@ethersproject/contracts";

import abi from "../../data/abis/steal-auction.json";
import config from "../../../config/default";
import { getEthereum } from "../ethereum";
import type { BigNumber } from "@ethersproject/bignumber";

const { address } = config.stealAuction;

export const StealAuction = async () => {
  const { signer } = getEthereum();
  const contract = new Contract(address, abi, signer);

  const buy = async (id: BigNumber, bid: BigNumber) => {
    await contract.buy(id, bid);
  };

  return {
    address,
    contract,
    buy,
  };
};
