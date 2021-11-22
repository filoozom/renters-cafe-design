import type { LP } from "./lp";

export type Pool = {
  id: bigint;
  token: string;
  allocation: bigint;
  balance: bigint;
  total: bigint;
  withdrawFee: bigint;
  accRentPerShare: bigint;
  lastRewardTimestamp: bigint;

  lp: LP;

  user: {
    total: bigint;
    balance: bigint;
    debt: bigint;
    rentHarvested: bigint;
  };
};
