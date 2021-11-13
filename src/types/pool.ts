import type { LP } from "./lp";

export type Pool = {
  id: bigint;
  token: string;
  allocation: bigint;
  balance: bigint;

  accRentPerShare?: bigint;
  lastRewardBlock?: bigint;

  lp: LP;
};
