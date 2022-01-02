import { BigNumber } from "@ethersproject/bignumber";
import { getAddress } from "@ethersproject/address";

import { Provider, createClient, dedupExchange, fetchExchange } from "urql";
import {
  cacheExchange,
  DataFields,
  ResolveInfo,
  Variables,
  Cache,
} from "@urql/exchange-graphcache";

import config from "../../config";

const toBigNumber = (
  parent: DataFields,
  _args: Variables,
  _cache: Cache,
  info: ResolveInfo
) => BigNumber.from(parent[info.fieldName]);

const toAddress = (
  parent: DataFields,
  _args: Variables,
  _cache: Cache,
  info: ResolveInfo
) => getAddress(parent[info.fieldName] as string);

export const client = createClient({
  url: config.subgraph,
  exchanges: [
    dedupExchange,
    cacheExchange({
      resolvers: {
        Cafe: {
          rentPerSecond: toBigNumber,
          totalAllocation: toBigNumber,
          withdrawFeePrecision: toBigNumber,
          accRentPrecision: toBigNumber,
          bonusEndTimestamp: toBigNumber,
          bonusMultiplier: toBigNumber,
        },
        Pool: {
          id: toBigNumber,
          allocation: toBigNumber,
          accRentPerShare: toBigNumber,
          lastRewardTimestamp: toBigNumber,
          balance: toBigNumber,
          total: toBigNumber,
        },
        User: {
          balance: toBigNumber,
          debt: toBigNumber,
          rentHarvested: toBigNumber,
          total: toBigNumber,
        },
        PropertyAuction: {
          id: toBigNumber,
          startPrice: toBigNumber,
          endPrice: toBigNumber,
          startTimestamp: toBigNumber,
          duration: toBigNumber,
        },
        PropertyAuctionContent: {
          count: toBigNumber,
          weight: toBigNumber,
        },
        PropertyAuctionCut: {
          amount: toBigNumber,
        },
        StealablePropertiesFactory: {
          multiplierPrecision: toBigNumber,
        },
        StealableProperty: {
          id: toBigNumber,
          cap: toBigNumber,
          minted: toBigNumber,
          multiplier: toBigNumber,
          bonus: toBigNumber,
          protection: toBigNumber,
          startRatio: toBigNumber,
          endRatio: toBigNumber,
          duration: toBigNumber,
          keepRatio: toBigNumber,
          stealMints: toBigNumber,
          stealMintsDone: toBigNumber,
          timeStolen: toBigNumber,
        },
        StealablePropertyOwner: {
          since: toBigNumber,
          price: toBigNumber,
          protectedUntil: toBigNumber,
        },
        LP: {
          id: toAddress,
        },
      },
    }),
    fetchExchange,
  ],
});

export { Provider };
