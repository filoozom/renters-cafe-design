import type { BigNumber } from "@ethersproject/bignumber";

export const formatNumber = (number: number) =>
  (Math.round(number * 100) / 100)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const compareBigNumber = (a: BigNumber, b: BigNumber) => {
  if (a.eq(b)) {
    return 0;
  }

  return a.gt(b) ? 1 : -1;
};
