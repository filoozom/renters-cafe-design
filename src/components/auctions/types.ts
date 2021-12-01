import type { BigNumber } from "@ethersproject/bignumber";

export type Pool = {
  id: BigNumber;
};

export type AuctionContract = {
  address: string;
  buy: (id: BigNumber, bid: BigNumber) => Promise<void>;
};

type StealablePropertyOwner = {
  id: string;
  user: string;
  protectedUntil: BigNumber;
  since: BigNumber;
  price: BigNumber;
};

export type StealableProperty = {
  id: BigNumber;
  name: string;
  cap: BigNumber;
  minted: BigNumber;
  pools: Pool[];
  multiplier: BigNumber;
  bonus: BigNumber;
  protection: BigNumber;
  startRatio: BigNumber;
  endRatio: BigNumber;
  duration: BigNumber;
  keepRatio: BigNumber;
  factory: {
    uri: string;
  };
  owners: StealablePropertyOwner[];
};

export type PropertyAuctionContent = {
  id: string;
  count: BigNumber;
  weight: BigNumber;
  property: StealableProperty;
};

export type PropertyAuction = {
  id: BigNumber;
  startPrice: BigNumber;
  endPrice: BigNumber;
  startTimestamp: BigNumber;
  duration: BigNumber;
  content: PropertyAuctionContent[];
};
