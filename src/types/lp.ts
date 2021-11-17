export type LP = {
  type: string;
  tokens: {
    address: string;
    symbol: string;
  }[];
  balance: bigint;
};
