import {
  Web3Provider,
  JsonRpcProvider,
  WebSocketProvider,
} from "@ethersproject/providers";
import config from "../../config";

export const cleanOutput = (object: Array<any>) => {
  const keys = new Set(Object.keys([...object]));
  const isBasicArray = keys.size === Object.keys(object).length;
  const result: any = isBasicArray ? [...object] : { ...object };

  for (const [key, value] of Object.entries(result)) {
    if (!isBasicArray && keys.has(key)) {
      delete result[key];
    } else if (Array.isArray(value)) {
      result[key] = cleanOutput(value);
    }
  }

  return result;
};

export const getProvider = (type: "http" | "ws") => {
  switch (type) {
    case "http":
      return new JsonRpcProvider(config.rpc[type]);
    case "ws":
      return new WebSocketProvider(config.rpc[type]);
  }
};

export const getEthereum = () => {
  const { ethereum } = window;
  if (!ethereum) {
    return {};
  }

  const provider = new Web3Provider(ethereum);
  const signer = provider.getSigner();

  return { ethereum, provider, signer };
};
