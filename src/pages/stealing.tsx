import { useEffect, useMemo, useState } from "preact/hooks";
import type { RouteComponentProps } from "@reach/router";
import { differenceInMilliseconds, intervalToDuration } from "date-fns";
import { useQuery } from "urql";

import config from "../../config/default";
import { getProvider, toBigInt } from "../lib/ethereum";
import classNames from "classnames";
import { round } from "../lib/tools";
import { StealAuction } from "../lib/contracts/steal-auction";
import { ERC20 } from "../lib/contracts/erc20";
import { constants } from "ethers";
import { SadIcon } from "../components/icons/sad";

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

type Pool = {
  id: bigint;
};

type StealablePropertyOwner = {
  id: string;
  user: string;
  protectedUntil: bigint;
  since: bigint;
  price: bigint;
};

type StealableProperty = {
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

type StealablePropertiesFactory = {
  properties: StealableProperty[];
};

// TODO: Integrate multiplierPrecision
const currentPrice = (property: StealableProperty) => {
  const now = BigInt(Math.round(Date.now() / 1000));
  const owner = property.owners[0];
  const secondsElapsed = now - owner.protectedUntil;

  const endPrice = (owner.price * property.endRatio) / 10000n;
  const startPrice = (owner.price * property.startRatio) / 10000n;

  if (secondsElapsed > property.duration) {
    return endPrice;
  }
  if (secondsElapsed < 0) {
    return startPrice;
  }

  const totalPriceChange = endPrice - startPrice;
  const currentPriceChange =
    (totalPriceChange * secondsElapsed) / property.duration;

  return startPrice + currentPriceChange;
};

const getPropertyMetadata = async (property: StealableProperty) => {
  const response = await fetch(
    property.factory.uri.replace(
      "{id}",
      BigInt(property.id).toString(16).padStart(64, "0")
    )
  );
  const { name, image } = await response.json();
  return { name, image };
};

const formatProtection = (protection: number) => {
  if (protection === 0) {
    return "none";
  }

  const duration = intervalToDuration({
    start: 0,
    end: protection * 1000,
  });
  return [duration.hours, duration.minutes, duration.seconds]
    .map((number) => (number || 0).toString().padStart(2, "0"))
    .join(":");
};

const Hero = () => (
  <div class="hero p-32 bg-gradient-to-br from-primary to-accent">
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

const PropertyCard = ({ property }: { property: StealableProperty }) => {
  // State
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState<{ name: string; image: string }>();
  const [isLocked, setIsLocked] = useState<boolean>();
  const [price, setPrice] = useState<bigint>(0n);
  const [countdown, setCountdown] =
    useState<ReturnType<typeof intervalToDuration>>();

  const startDate = useMemo(
    () => new Date(1000 * Number(property.owners[0].protectedUntil)),
    [property.owners[0].protectedUntil]
  );

  useEffect(() => {
    const difference = differenceInMilliseconds(startDate, new Date());
    setIsLocked(difference > 0);

    const timeout = setTimeout(() => setIsLocked(false), difference);
    return () => {
      clearTimeout(timeout);
    };
  }, [startDate]);

  useEffect(() => {
    const refresh = () => {
      const end = differenceInMilliseconds(startDate, new Date());
      setCountdown(intervalToDuration({ start: 0, end }));
      setPrice(currentPrice(property));
    };
    refresh();

    const interval = setInterval(refresh, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [startDate]);

  useEffect(() => {
    getPropertyMetadata(property).then(setMetadata);
  }, [property]);

  const buy = async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    try {
      // Check allowance
      const token = await ERC20(config.rent.address);
      if (
        !(await token.checkAllowance(config.propertyAuction.address, price))
      ) {
        const tx = await token.approve(
          config.propertyAuction.address,
          toBigInt(constants.MaxUint256)
        );
        await tx.wait();
      }

      // Buy
      const propertyAuction = await StealAuction();
      await propertyAuction.buy(property.id, price);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class={`card bordered shadow ${isLocked && "opacity-50"}`}>
      {isLocked && (
        <button class="btn absolute top-4 right-4 indicator">
          protected
          <div class="badge badge-secondary ml-2">
            <span class="font-mono countdown">
              <span style={{ "--value": countdown?.hours }}></span>:
              <span style={{ "--value": countdown?.minutes }}></span>:
              <span style={{ "--value": countdown?.seconds }}></span>
            </span>
          </div>
        </button>
      )}
      <figure>
        <img
          src={
            metadata?.image ||
            `https://properties.renter.cafe/pictures/${property.id}.png`
          }
        />
      </figure>
      <div class="card-body text-left p-4">
        <h2 class="card-title">
          {metadata?.name}
          {!property.pools.length && (
            <div class="badge badge-accent ml-2">all pools</div>
          )}
        </h2>
        <div class="divider">Stats</div>
        <div class="flex justify-between">
          <span>Multiplier</span>
          <span>+{Number(property.multiplier) / 100}%</span>
        </div>
        <div class="flex justify-between">
          <span>Bonus</span>
          <span>{property.bonus}</span>
        </div>
        <div class="flex justify-between">
          <span>Protection</span>
          <span>{formatProtection(Number(property.protection))}</span>
        </div>
        <div class="divider">Pools</div>
        {property.pools.length ? (
          <ul class="list-disc list-inside">
            {/* TODO: Insert actual pool names */}
            {property.pools.map(({ id }) => (
              <li>{id}</li>
            ))}
          </ul>
        ) : (
          <p>This property is compatible with every pool</p>
        )}
        <button
          class={classNames(
            "btn",
            "btn-secondary",
            "mt-4",
            "w-full",
            "box-border",
            isLocked && "btn-disabled"
          )}
          onClick={buy}
        >
          Buy for {round(Number(price) / 1e18)} RENT
        </button>
      </div>
    </div>
  );
};

const PropertyCardMenu = () => (
  <div class="flex justify-center mb-4 flex-col sm:flex-row xs:w-auto w-full">
    <select class="select select-bordered m-2">
      <option disabled selected>
        Availability
      </option>
      <option>All</option>
      <option>Available</option>
      <option>Locked</option>
    </select>
    <select class="select select-bordered m-2">
      <option disabled selected>
        Bonus type
      </option>
      <option>All</option>
      <option>Ratio increase</option>
      <option>LP increase</option>
    </select>
    <div class="relative m-2">
      <input
        type="text"
        placeholder="Search"
        class="w-full pr-16 input input-primary input-bordered"
      />
      <button class="absolute top-0 right-0 rounded-l-none btn btn-primary">
        go
      </button>
    </div>
  </div>
);

const PropertyCards = () => {
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

  if (!result.data) {
    return <p>Loading...</p>;
  }

  const { stealablePropertiesFactory: sp } = result.data;

  return (
    <div class="hero">
      <div class="max-w-5xl mx-auto text-center hero-content">
        <div class="mb-2">
          <PropertyCardMenu />
          {sp.properties.length ? (
            <div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {sp.properties.map((property) => (
                <PropertyCard property={property} />
              ))}
            </div>
          ) : (
            <div class="text-center bg-base-200 p-8 rounded-3xl">
              <div class="w-64 mx-auto mb-4">
                <SadIcon />
              </div>
              <p>
                There are currently no auctions going on, nor are there auctions
                starting in the next 24 hours...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

type StealingPageProps = RouteComponentProps;

export const StealingPage = (_: StealingPageProps) => (
  <>
    <Hero />
    <PropertyCards />
  </>
);
