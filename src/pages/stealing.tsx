import { useEffect, useMemo, useState } from "preact/hooks";
import type { RouteComponentProps } from "@reach/router";
import { useQuery } from "urql";

import config from "../../config";
import { getProvider } from "../lib/ethereum";
import { StealAuction } from "../lib/contracts/steal-auction";
import type {
  AuctionContract,
  PropertyAuction,
  StealableProperty,
} from "../components/auctions/types";
import { Auctions } from "../components/auctions/auctions";
import { One } from "@ethersproject/constants";
import { compareBigNumber } from "../lib/tools";

const StealingQuery = `
  query ($stealableProperties: ID!) {
    stealablePropertiesFactory(id: $stealableProperties) {
      id
      properties(where: { owners_not: [] }) {
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
        owners(orderBy: timestamp, orderDirection: asc) {
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
  <div class="hero py-32 bg-gradient-to-br from-primary to-secondary">
    <div class="text-center hero-content text-accent-content">
      <div class="max-w-lg">
        <h1 class="mb-8 text-5xl font-bold">Stealing</h1>
        <p>
          Everything is accepted in farms and NFTs.
          <br />
          Like it? Go ahead and steal it! No prison this time! Your NFT, your
          ticket to WAGMI land!
        </p>
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

    const getSortKey = (auction: PropertyAuction) =>
      auction.content[0].property.owners[0].protectedUntil;

    const { stealablePropertiesFactory: sp } = result.data;
    return sp.properties
      .map((property) => {
        const [owner] = property.owners;
        return {
          id: property.id,
          startPrice: owner.price.mul(property.startRatio).div(10000),
          endPrice: owner.price.mul(property.startRatio).div(10000),
          startTimestamp: owner.protectedUntil,
          duration: property.duration,
          content: [
            {
              id: "0",
              count: One,
              weight: One,
              property,
            },
          ],
        };
      })
      .sort((a, b) => compareBigNumber(getSortKey(a), getSortKey(b)));
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
