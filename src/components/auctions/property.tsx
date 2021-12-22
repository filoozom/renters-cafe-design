import { useContext, useEffect, useMemo, useState } from "preact/hooks";
import { differenceInMilliseconds, intervalToDuration } from "date-fns";
import { MaxUint256, Zero } from "@ethersproject/constants";
import { BigNumber } from "@ethersproject/bignumber";

// Config
import config from "../../../config";

// Lib
import { ERC20 } from "../../lib/contracts/erc20";
import { formatNumber } from "../../lib/tools";

// Components
import { AlertsContext, AlertType } from "../alerts/alerts";
import { WalletButton } from "../wallet-button";

// Types
import type {
  AuctionContract,
  StealableProperty,
  PropertyAuction,
} from "./types";

const currentPrice = (auction: PropertyAuction) => {
  const now = BigNumber.from(Math.round(Date.now() / 1000));
  const secondsElapsed = now.sub(auction.startTimestamp);

  if (secondsElapsed.gt(auction.duration)) {
    return auction.endPrice;
  }

  if (secondsElapsed.lt(0)) {
    return auction.startPrice;
  }

  const totalPriceChange = auction.endPrice.sub(auction.startPrice);
  const currentPriceChange = totalPriceChange
    .mul(secondsElapsed)
    .div(auction.duration);

  return auction.startPrice.add(currentPriceChange);
};

const getPropertyMetadata = async (property: StealableProperty) => {
  const response = await fetch(
    property.factory.uri.replace(
      "{id}",
      property.id.toHexString().substr(2).padStart(64, "0")
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
  const [isLocked, setIsLocked] = useState(false);
  const [price, setPrice] = useState(Zero);
  const [countdown, setCountdown] =
    useState<ReturnType<typeof intervalToDuration>>();

  const startDate = useMemo(
    () => new Date(1000 * Number(auction.startTimestamp)),
    [auction.startTimestamp]
  );

  // Alerts
  const { addAlert } = useContext(AlertsContext);

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
        const tx = await token.approve(contract.address, MaxUint256);
        await tx.wait();
      }

      // Buy
      await contract.buy(auction.id, price);
    } catch (err) {
      const message = (err as any)?.data?.message as string;
      if (message) {
        addAlert({ type: AlertType.ERROR, message });
      }
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
          <span>{property.bonus.toString()}</span>
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
              <li>{id.toString()}</li>
            ))}
          </ul>
        ) : (
          <p>This property is compatible with every pool</p>
        )}
        <WalletButton
          class="btn-secondary mt-4 w-full box-border"
          disabled={isLocked}
          onClick={buy}
          pulse={true}
        >
          {buttonAction} for {formatNumber(Number(price) / 1e18)} RENT
        </WalletButton>
      </div>
    </div>
  );
};
