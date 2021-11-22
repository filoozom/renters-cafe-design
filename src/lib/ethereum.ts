import { BigNumber, providers } from "ethers";
import config from "../../config/default";

export const toBigInt = (value: BigNumber) =>
  BigInt(BigNumber.from(value).toString());

export const cleanOutput = (object: Array<any>) => {
  const keys = new Set(Object.keys([...object]));
  const isBasicArray = keys.size === Object.keys(object).length;
  const result: any = isBasicArray ? [...object] : { ...object };

  for (const [key, value] of Object.entries(result)) {
    if (!isBasicArray && keys.has(key)) {
      delete result[key];
    } else if (BigNumber.isBigNumber(value)) {
      result[key] = toBigInt(value);
    } else if (Array.isArray(value)) {
      result[key] = cleanOutput(value);
    }
  }

  return result;
};

export const getSigner = () => {
  const { ethereum } = window;
  const provider = new providers.Web3Provider(ethereum);
  return provider.getSigner();
};

export const getProvider = (type: "http" | "ws") => {
  switch (type) {
    case "http":
      return new providers.JsonRpcProvider(config.rpc[type]);
    case "ws":
      return new providers.WebSocketProvider(config.rpc[type]);
  }
};
