export type LP = {
  type: string;
  tokens: {
    address: string;
    symbol: string;
  }[];
  balance: bigint;
  name: string;
  symbol: string;
};
