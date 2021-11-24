import { Provider, createClient, dedupExchange, fetchExchange } from "urql";
import {
  cacheExchange,
  DataFields,
  ResolveInfo,
  Variables,
  Cache,
} from "@urql/exchange-graphcache";

const toBigInt = (
  parent: DataFields,
  _args: Variables,
  _cache: Cache,
  info: ResolveInfo
): BigInt => BigInt(parent[info.fieldName] as string);

export const client = createClient({
  url: "http://srv02.apyos.com:8000/subgraphs/name/renter-cafe/cafe",
  exchanges: [
    dedupExchange,
    cacheExchange({
      resolvers: {
        Cafe: {
          rentPerSecond: toBigInt,
          totalAllocation: toBigInt,
          withdrawFeePrecision: toBigInt,
          accRentPrecision: toBigInt,
          bonusEndTimestamp: toBigInt,
          bonusMultiplier: toBigInt,
        },
        Pool: {
          id: toBigInt,
          allocation: toBigInt,
          accRentPerShare: toBigInt,
          lastRewardTimestamp: toBigInt,
          balance: toBigInt,
          total: toBigInt,
        },
        User: {
          balance: toBigInt,
          debt: toBigInt,
          rentHarvested: toBigInt,
          total: toBigInt,
        },
        PropertyAuction: {
          id: toBigInt,
          startPrice: toBigInt,
          endPrice: toBigInt,
          startTimestamp: toBigInt,
          duration: toBigInt,
        },
        PropertyAuctionContent: {
          count: toBigInt,
          weight: toBigInt,
        },
        PropertyAuctionCut: {
          amount: toBigInt,
        },
        StealablePropertiesFactory: {
          multiplierPrecision: toBigInt,
        },
        StealableProperty: {
          cap: toBigInt,
          minted: toBigInt,
          multiplier: toBigInt,
          bonus: toBigInt,
          protection: toBigInt,
          startRatio: toBigInt,
          endRatio: toBigInt,
          duration: toBigInt,
          keepRatio: toBigInt,
          stealMints: toBigInt,
          stealMintsDone: toBigInt,
          timeStolen: toBigInt,
        },
        StealablePropertyOwner: {
          since: toBigInt,
          price: toBigInt,
          protectedUntil: toBigInt,
        },
      },
    }),
    fetchExchange,
  ],
});

export { Provider };
