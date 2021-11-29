import { changeInput, changeSelect } from "../../lib/forms";

export enum Availability {
  ALL,
  AVAILABLE,
  LOCKED,
}

export enum BonusType {
  ALL,
  MULTIPLIER,
  BONUS,
}

export type AuctionMenuProps = {
  onAvailability: (availability: Availability) => void;
  onBonusType: (bonusType: BonusType) => void;
  onSearch: (search: string) => void;
};

export const AuctionMenu = ({
  onAvailability,
  onBonusType,
  onSearch,
}: AuctionMenuProps) => (
  <div class="flex justify-center mb-4 flex-col sm:flex-row xs:w-auto w-full">
    <select
      class="select select-bordered m-2"
      onChange={(event) =>
        changeSelect<Availability>(onAvailability, event, parseInt)
      }
    >
      <option disabled selected>
        Availability
      </option>
      <option value={Availability.ALL}>All</option>
      <option value={Availability.AVAILABLE}>Available</option>
      <option value={Availability.LOCKED}>Locked</option>
    </select>
    <select
      class="select select-bordered m-2"
      onChange={(event) =>
        changeSelect<BonusType>(onBonusType, event, parseInt)
      }
    >
      <option disabled selected>
        Bonus type
      </option>
      <option value={BonusType.ALL}>All</option>
      <option value={BonusType.MULTIPLIER}>Ratio increase</option>
      <option value={BonusType.BONUS}>LP increase</option>
    </select>
    {/*
    <div class="relative m-2">
      <input
        type="text"
        placeholder="Search"
        class="w-full pr-16 input input-primary input-bordered"
        onChange={(event) => changeInput<string>(onSearch, event)}
      />
      <button class="absolute top-0 right-0 rounded-l-none btn btn-primary">
        go
      </button>
    </div>
    */}
  </div>
);
