import type { LP } from "./lp";

export type Pool = {
  id: bigint;
  token: string;
  allocation: bigint;
  balance: bigint;
  withdrawFee: bigint;

  accRentPerShare?: bigint;
  lastRewardBlock?: bigint;

  lp: LP;
};
