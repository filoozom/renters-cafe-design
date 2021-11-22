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
        },
        Pool: {
          id: toBigInt,
          allocation: toBigInt,
        },
        User: {
          balance: toBigInt,
          debt: toBigInt,
          rentHarvested: toBigInt,
        },
      },
    }),
    fetchExchange,
  ],
});

export { Provider };
