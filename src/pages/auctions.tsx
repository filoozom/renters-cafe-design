import { useEffect, useState } from "preact/hooks";
import type { RouteComponentProps } from "@reach/router";
import { useQuery } from "urql";
import type { BigNumber } from "@ethersproject/bignumber";

import config from "../../config";
import { getProvider } from "../lib/ethereum";
import { PropertyAuction as PropertyAuctionContract } from "../lib/contracts/property-auction";
import { Auctions } from "../components/auctions/auctions";
import type {
  AuctionContract,
  PropertyAuction,
} from "../components/auctions/types";
import { Loading } from "../components/loading";

const AuctionsQuery = `
  query ($propertyAuction: ID!, $maxStartTimestamp: BigInt!) {
    propertyAuctionFactory(id: $propertyAuction,) {
      id
      cuts {
        id
        user
        amount
      }
      auctions(where: { done: false, startTimestamp_lt: $maxStartTimestamp }, orderBy: startTimestamp, orderDirection: asc) {
        id
        startPrice
        endPrice
        startTimestamp
        duration
        content {
          id
          count
          weight
          property {
            id
            cap
            minted
            pools {
              id
            }
            multiplier
            bonus
            protection
            startRatio
            endRatio
            duration
            keepRatio            
            factory {
              id
              uri
            }
          }
        }
      }
    }
  }
`;

type PropertyAuctionCut = {
  user: string;
  amount: BigNumber;
};

type PropertyAuctionFactory = {
  id: string;
  cuts: PropertyAuctionCut[];
  auctions: PropertyAuction[];
};

const Hero = () => (
  <div class="hero py-32 bg-gradient-to-br from-secondary to-primary">
    <div class="text-center hero-content text-accent-content">
      <div class="max-w-lg">
        <h1 class="mb-8 text-5xl font-bold">Auctions</h1>
        <p>
          Massive yields are not enough for you?
          <br />
          Get a NFT villa right now and push the returns even higher!
        </p>
      </div>
    </div>
  </div>
);

const PropertyCards = () => {
  const [contract, setContract] = useState<AuctionContract>();
  const [result, refresh] = useQuery<{
    propertyAuctionFactory: PropertyAuctionFactory;
  }>({
    query: AuctionsQuery,
    variables: {
      propertyAuction: config.propertyAuction.address.toLowerCase(),
      maxStartTimestamp: Math.round(Date.now() / 1000 + 24 * 60 * 60),
    },
  });

  const refetch = () => refresh({ requestPolicy: "network-only" });

  useEffect(() => {
    const provider = getProvider("ws");
    provider.on("block", refetch);
    return () => {
      provider.off("block", refetch);
    };
  }, []);

  useEffect(() => {
    PropertyAuctionContract().then(setContract);
  }, []);

  if (!result.data || !contract) {
    return <Loading />;
  }

  const { propertyAuctionFactory: pa } = result.data;
  return (
    <Auctions auctions={pa.auctions} contract={contract} buttonAction="buy" />
  );
};

type PropertiesPageProps = RouteComponentProps;

export const AuctionsPage = (_: PropertiesPageProps) => (
  <>
    <Hero />
    <PropertyCards />
  </>
);
