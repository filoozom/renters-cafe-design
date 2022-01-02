import type { BigNumber } from "@ethersproject/bignumber";

export type LP = {
  id: string;
  type: string;
  tokens: {
    address: string;
    symbol: string;
  }[];
  balance: BigNumber;
  name: string;
  symbol: string;
};
