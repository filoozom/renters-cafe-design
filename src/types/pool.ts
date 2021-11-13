export type Pool = {
  type: "Trader Joe";
  id: number;
  token: string;
  allocation: number;
  balance: number;
  tokens: {
    address: string;
    name: string;
  }[];
};
