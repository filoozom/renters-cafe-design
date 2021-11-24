import { Contract } from "ethers";

import abi from "../../data/abis/property-auction.json";
import config from "../../../config/default";
import { getSigner } from "../ethereum";

export const PropertyAuction = async () => {
  const signer = getSigner();
  const contract = new Contract(config.propertyAuction.address, abi, signer);

  const buy = async (id: bigint, bid: bigint) => {
    await contract.buy(id, bid);
  };

  return {
    contract,
    buy,
  };
};
