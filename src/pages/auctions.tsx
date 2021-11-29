import { useEffect, useState } from "preact/hooks";
import type { RouteComponentProps } from "@reach/router";
import { useQuery } from "urql";

import config from "../../config/default";
import { getProvider } from "../lib/ethereum";
import { PropertyAuction as PropertyAuctionContract } from "../lib/contracts/property-auction";
import { Auctions } from "../components/auctions/auctions";
import type {
  AuctionContract,
  PropertyAuction,
} from "../components/auctions/types";

const AuctionsQuery = `
  query ($propertyAuction: ID!, $maxStartTimestamp: BigInt!) {
    propertyAuctionFactory(id: $propertyAuction,) {
      id
      cuts {
        user
        amount
      }
      auctions(where: { done: false, startTimestamp_lt: $maxStartTimestamp }) {
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
  amount: bigint;
};

type PropertyAuctionFactory = {
  id: string;
  cuts: PropertyAuctionCut[];
  auctions: PropertyAuction[];
};

const Hero = () => (
  <div class="hero p-32 bg-gradient-to-br from-secondary to-primary">
    <div class="text-center hero-content text-accent-content">
      <div class="max-w-lg">
        <h1 class="mb-8 text-5xl font-bold">
          Create, sell and collect digital items
        </h1>
        <p class="mb-8">
          Unit of data stored on a digital ledger, called a blockchain, that
          certifies a digital asset to be unique and therefore not
          interchangeable
        </p>
        <button class="btn btn-primary">Get Started</button>
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
    return <p>Loading...</p>;
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
