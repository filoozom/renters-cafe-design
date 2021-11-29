import { useEffect, useMemo, useState } from "preact/hooks";
import type { RouteComponentProps } from "@reach/router";
import { useQuery } from "urql";

import config from "../../config/default";
import { getProvider } from "../lib/ethereum";
import { StealAuction } from "../lib/contracts/steal-auction";
import {
  AuctionContract,
  StealableProperty,
} from "../components/auctions/types";
import { Auctions } from "../components/auctions/auctions";

const StealingQuery = `
  query ($stealableProperties: ID!) {
    stealablePropertiesFactory(id: $stealableProperties) {
      properties(where: {owners_not: []}) {
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
        owners {
          id
          user
          protectedUntil
          since
          price
        }
      }
    }
  }
`;

type StealablePropertiesFactory = {
  properties: StealableProperty[];
};

const Hero = () => (
  <div class="hero p-32 bg-gradient-to-br from-primary to-secondary">
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
    stealablePropertiesFactory: StealablePropertiesFactory;
  }>({
    query: StealingQuery,
    variables: {
      stealableProperties: config.stealableProperties.address.toLowerCase(),
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
    StealAuction().then(setContract);
  }, []);

  const auctions = useMemo(() => {
    if (!result.data) {
      return null;
    }

    const { stealablePropertiesFactory: sp } = result.data;
    return sp.properties.map((property) => {
      const [owner] = property.owners;
      return {
        id: property.id,
        startPrice: (owner.price * property.startRatio) / 10000n,
        endPrice: (owner.price * property.startRatio) / 10000n,
        startTimestamp: owner.protectedUntil,
        duration: property.duration,
        content: [
          {
            id: "0",
            count: 1n,
            weight: 1n,
            property,
          },
        ],
      };
    });
  }, [result.data]);

  if (!auctions || !contract) {
    return <p>Loading...</p>;
  }

  return (
    <Auctions auctions={auctions} contract={contract} buttonAction="steal" />
  );
};

type StealingPageProps = RouteComponentProps;

export const StealingPage = (_: StealingPageProps) => (
  <>
    <Hero />
    <PropertyCards />
  </>
);
