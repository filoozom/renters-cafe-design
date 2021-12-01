import type { LP } from "./lp";
import type { BigNumber } from "@ethersproject/bignumber";

export type Pool = {
  id: BigNumber;
  token: string;
  allocation: BigNumber;
  balance: BigNumber;
  total: BigNumber;
  withdrawFee: BigNumber;
  accRentPerShare: BigNumber;
  lastRewardTimestamp: BigNumber;

  lp: LP;

  user: {
    total: BigNumber;
    balance: BigNumber;
    debt: BigNumber;
    rentHarvested: BigNumber;
  };
};
