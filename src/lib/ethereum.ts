import { BigNumber } from "ethers";

export const toBigNumber = (value: BigNumber) =>
  BigInt(BigNumber.from(value).toString());

export const cleanOutput = (object) => {
  const keys = Object.keys(object);
  const isArray =
    (Array.isArray(object) && !keys.length) ||
    !isNaN(parseInt(keys[keys.length - 1]));
  const result = isArray ? [...object] : { ...object };

  for (const [key, value] of Object.entries(result)) {
    if (!isArray && !isNaN(Number(key))) {
      delete result[key];
    } else if (BigNumber.isBigNumber(value)) {
      result[key] = BigInt(BigNumber.from(value).toString());
    } else if (typeof value === "object") {
      result[key] = cleanOutput(value);
    }
  }

  return result;
};
