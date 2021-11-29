import { useEffect, useMemo, useState } from "preact/hooks";
import classNames from "classnames";
import { differenceInMilliseconds, intervalToDuration } from "date-fns";
import { constants } from "ethers";

// Config
import config from "../../../config/default";

// Lib
import { ERC20 } from "../../lib/contracts/erc20";
import { toBigInt } from "../../lib/ethereum";
import { round } from "../../lib/tools";

// Types
import type {
  AuctionContract,
  StealableProperty,
  PropertyAuction,
} from "./types";

const currentPrice = (auction: PropertyAuction) => {
  const now = BigInt(Math.round(Date.now() / 1000));
  const secondsElapsed = now - auction.startTimestamp;

  if (secondsElapsed > auction.duration) {
    return auction.endPrice;
  }

  if (secondsElapsed < 0) {
    return auction.startPrice;
  }

  const totalPriceChange = auction.endPrice - auction.startPrice;
  const currentPriceChange =
    (totalPriceChange * secondsElapsed) / auction.duration;

  return auction.startPrice + currentPriceChange;
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

export const AuctionProperty = ({
  auction,
  contract,
  buttonAction,
}: {
  auction: PropertyAuction;
  contract: AuctionContract;
  buttonAction: "buy" | "steal";
}) => {
  // TODO: Add support for multiple properties in the same auction
  const { property } = auction.content[0];

  // State
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState<{ name: string; image: string }>();
  const [isLocked, setIsLocked] = useState<boolean>();
  const [price, setPrice] = useState<bigint>(0n);
  const [countdown, setCountdown] =
    useState<ReturnType<typeof intervalToDuration>>();

  const startDate = useMemo(
    () => new Date(1000 * Number(auction.startTimestamp)),
    [auction.startTimestamp]
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
      setPrice(currentPrice(auction));
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
      if (!(await token.checkAllowance(contract.address, price))) {
        const tx = await token.approve(
          contract.address,
          toBigInt(constants.MaxUint256)
        );
        await tx.wait();
      }

      // Buy
      await contract.buy(auction.id, price);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class={`card bordered shadow ${isLocked && "opacity-50"}`}>
      {isLocked && (
        <button class="btn absolute top-4 right-4 indicator">
          upcoming
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
          {buttonAction} for {round(Number(price) / 1e18)} RENT
        </button>
      </div>
    </div>
  );
};