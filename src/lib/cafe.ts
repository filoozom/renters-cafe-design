import { providers, Contract } from "ethers";
import abi from "../data/abis/cafe.json";
import { cleanOutput } from "./ethereum";
import config from "../../config/default";

export const Cafe = async () => {
  const { ethereum } = window;
  const provider = new providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const contract = new Contract(config.cafe.address, abi, signer);

  const getPools = async () => {
    const count = await contract.poolLength();
    const pools = [];
    for (let id = 0; id < count; id++) {
      pools.push(await contract.pools(id));
    }
    return cleanOutput(pools);
  };

  return {
    contract,
    getPools,
  };
};
