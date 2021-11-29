import { SadIcon } from "../icons/sad";

import type { PropertyAuction, AuctionContract } from "./types";
import { AuctionProperty } from "./property";
import { AuctionMenu } from "./menu";

export const Auctions = ({
  auctions,
  contract,
  buttonAction,
}: {
  auctions: PropertyAuction[];
  contract: AuctionContract;
  buttonAction: "buy" | "steal";
}) => {
  return (
    <div class="hero">
      <div class="max-w-5xl mx-auto text-center hero-content">
        <div class="mb-2">
          <AuctionMenu />
          {auctions.length ? (
            <div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {auctions.map((auction) => (
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
