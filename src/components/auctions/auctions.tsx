import { useMemo, useState } from "preact/hooks";

import { SadIcon } from "../icons/sad";

import type { PropertyAuction, AuctionContract } from "./types";
import { AuctionProperty } from "./property";
import { AuctionMenu, Availability, BonusType } from "./menu";
import { Disclaimer } from "../disclaimer";

const hasMultiplier = (auction: PropertyAuction) => {
  return auction.content.some((content) => content.property.multiplier.gt(0));
};

const hasBonus = (auction: PropertyAuction) => {
  return auction.content.some((content) => content.property.bonus.gt(0));
};

export const Auctions = ({
  auctions,
  contract,
  buttonAction,
}: {
  auctions: PropertyAuction[];
  contract: AuctionContract;
  buttonAction: "buy" | "steal";
}) => {
  const [availability, setAvailability] = useState<Availability>(
    Availability.ALL
  );
  const [bonusType, setBonusType] = useState<BonusType>(BonusType.ALL);

  // TODO: Support multi-property auctions
  // TODO: Update when startTimestamp matches in real time
  const filtered = useMemo(
    () =>
      auctions.filter((auction) => {
        if (availability !== Availability.ALL) {
          const started = Number(auction.startTimestamp) <= Date.now() / 1000;
          if (started && availability === Availability.LOCKED) {
            return false;
          }
          if (!started && availability === Availability.AVAILABLE) {
            return false;
          }
        }

        if (bonusType !== BonusType.ALL) {
          const ok =
            bonusType === BonusType.BONUS
              ? hasBonus(auction)
              : hasMultiplier(auction);

          if (!ok) {
            return false;
          }
        }

        return true;
      }),
    [auctions, availability, bonusType]
  );

  const hasFilter = auctions.length !== filtered.length;

  return (
    <div class="hero">
      <div class="max-w-5xl mx-auto text-center hero-content">
        <div class="mb-2">
          <AuctionMenu
            onAvailability={setAvailability}
            onBonusType={setBonusType}
            onSearch={() => {}}
          />
          <Disclaimer class="-mt-2 mb-2" />
          {filtered.length ? (
            <div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((auction) => (
                <AuctionProperty
                  auction={auction}
                  contract={contract}
                  buttonAction={buttonAction}
                />
              ))}
            </div>
          ) : (
            <div class="text-center bg-base-200 p-8 rounded-3xl">
              <div class="w-64 mx-auto mb-4">
                <SadIcon />
              </div>
              <p>
                There are currently no auctions{" "}
                {hasFilter && "matching those filters"} going on, nor are there
                auctions {hasFilter && "matching those filters"} starting in the
                next 24 hours...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
