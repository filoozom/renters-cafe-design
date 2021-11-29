export type Pool = {
  id: bigint;
};

export type AuctionContract = {
  address: string;
  buy: (id: bigint, bid: bigint) => Promise<void>;
};

type StealablePropertyOwner = {
  id: string;
  user: string;
  protectedUntil: bigint;
  since: bigint;
  price: bigint;
};

export type StealableProperty = {
  id: bigint;
  name: string;
  cap: bigint;
  minted: bigint;
  pools: Pool[];
  multiplier: bigint;
  bonus: bigint;
  protection: bigint;
  startRatio: bigint;
  endRatio: bigint;
  duration: bigint;
  keepRatio: bigint;
  factory: {
    uri: string;
  };
  owners: StealablePropertyOwner[];
};

export type PropertyAuctionContent = {
  id: string;
  count: bigint;
  weight: bigint;
  property: StealableProperty;
};

export type PropertyAuction = {
  id: bigint;
  startPrice: bigint;
  endPrice: bigint;
  startTimestamp: bigint;
  duration: bigint;
  content: PropertyAuctionContent[];
};
