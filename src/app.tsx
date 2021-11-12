import { useEffect, useState } from "preact/hooks";
import {
  addSeconds,
  differenceInMilliseconds,
  intervalToDuration,
} from "date-fns";

type Property = {
  id: number;
  name: string;
  cap: number;
  minted: number;
  poolIds: Array<number>;
  multiplier: number;
  bonus: number;
  protection: number;
  startRatio: number;
  endRatio: number;
  duration: number;
  keepRatio: number;
  lockedUntil: Date;
};

const poolNameToId = {
  "RENT-USDT.e": 1,
  "RENT-AXAV": 2,
  "RENT-JOE": 3,
  "RENT-WBTC.e": 4,
  "AVAX-TIME": 5,
  "USDC.e-USDT.e": 6,
  "MIM-TIME": 7,
};

const poolIdToName = {
  1: "RENT-USDT.e",
  2: "RENT-AXAV",
  3: "RENT-JOE",
  4: "RENT-WBTC.e",
  5: "AVAX-TIME",
  6: "USDC.e-USDT.e",
  7: "MIM-TIME",
};

const properties: Array<Property> = [
  {
    name: "Coffee house",
    id: 1,
    cap: 6,
    minted: 0,
    poolIds: [poolNameToId["RENT-USDT.e"]],
    multiplier: 500,
    bonus: 0,
    protection: 43507,
    startRatio: 51000,
    endRatio: 20000,
    duration: 3695,
    keepRatio: 1500,
    lockedUntil: addSeconds(new Date(), 60),
  },
  {
    name: "Terrased house",
    id: 2,
    cap: 2,
    minted: 0,
    poolIds: [],
    multiplier: 3000,
    bonus: 0,
    protection: 177034,
    startRatio: 84000,
    endRatio: 8000,
    duration: 33089,
    keepRatio: 24,
    lockedUntil: addSeconds(new Date(), 10),
  },
  {
    name: "Two story home with garage",
    id: 3,
    cap: 16,
    minted: 0,
    poolIds: [poolNameToId["RENT-USDT.e"], poolNameToId["RENT-AXAV"]],
    multiplier: 3000,
    bonus: 0,
    protection: 74612,
    startRatio: 97000,
    endRatio: 27000,
    duration: 14400,
    keepRatio: 3600,
    lockedUntil: addSeconds(new Date(), 6513),
  },
  {
    name: "Villa",
    id: 4,
    cap: 20,
    minted: 0,
    poolIds: [
      poolNameToId["RENT-JOE"],
      poolNameToId["RENT-WBTC.e"],
      poolNameToId["AVAX-TIME"],
    ],
    multiplier: 6600,
    bonus: 0,
    protection: 440802,
    startRatio: 105000,
    endRatio: 16000,
    duration: 17481,
    keepRatio: 1000,
    lockedUntil: addSeconds(new Date(), 540),
  },
  {
    name: "Mansion",
    id: 5,
    cap: 10,
    minted: 0,
    poolIds: [
      poolNameToId["USDC.e-USDT.e"],
      poolNameToId["MIM-TIME"],
      poolNameToId["AVAX-TIME"],
    ],
    multiplier: 81000,
    bonus: 0,
    protection: 530810,
    startRatio: 109000,
    endRatio: 39000,
    duration: 5206,
    keepRatio: 2500,
    lockedUntil: addSeconds(new Date(), 0),
  },
];

const DrawerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    class="inline-block w-6 h-6 stroke-current"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

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

const formatProtection = (protection) => {
  const duration = intervalToDuration({
    start: 0,
    end: protection * 1000,
  });
  return [duration.hours, duration.minutes, duration.seconds]
    .map((number) => (number || 0).toString().padStart(2, "0"))
    .join(":");
};

const PropertyCard = ({ property }: { property: Property }) => {
  const [isLocked, setIsLocked] = useState<boolean>();
  const [countdown, setCountdown] =
    useState<ReturnType<typeof intervalToDuration>>();

  useEffect(() => {
    const difference = differenceInMilliseconds(
      property.lockedUntil,
      new Date()
    );
    setIsLocked(difference > 0);

    const timeout = setTimeout(() => setIsLocked(false), difference);
    return () => {
      clearTimeout(timeout);
    };
  }, [property.lockedUntil]);

  useEffect(() => {
    const refresh = () => {
      const end = differenceInMilliseconds(property.lockedUntil, new Date());
      setCountdown(intervalToDuration({ start: 0, end }));
    };
    refresh();

    const interval = setInterval(refresh, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [property.lockedUntil]);

  return (
    <div class={`card bordered shadow ${isLocked && "opacity-50"}`}>
      {isLocked && (
        <button class="btn absolute top-4 right-4 indicator">
          locked
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
            new URL(`./assets/properties/${property.id}.png`, import.meta.url)
              .href
          }
        />
      </figure>
      <div class="card-body text-left p-4">
        <h2 class="card-title">
          {property.name}
          {!property.poolIds.length && (
            <div class="badge badge-accent ml-2">all pools</div>
          )}
        </h2>
        <div class="divider">Stats</div>
        <div class="flex justify-between">
          <span>Multiplier</span>
          <span>+{property.multiplier / 100}%</span>
        </div>
        <div class="flex justify-between">
          <span>Bonus</span>
          <span>{property.bonus}</span>
        </div>
        <div class="flex justify-between">
          <span>Protection</span>
          <span>{formatProtection(property.protection)}</span>
        </div>
        <div class="divider">Pools</div>
        {property.poolIds.length ? (
          <ul class="list-disc list-inside">
            {property.poolIds.map((id) => (
              <li>{poolIdToName[id]}</li>
            ))}
          </ul>
        ) : (
          <p>This property is compatible with every pool</p>
        )}
        <div class="justify-end card-actions">
          <button class={`btn btn-secondary ${isLocked && "btn-disabled"}`}>
            Steal
          </button>
        </div>
      </div>
    </div>
  );
};

const PropertyCards = () => (
  <div class="hero">
    <div class="max-w-5xl mx-auto text-center hero-content">
      <div>
        <PropertyCardMenu />
        <div class="grid grid-cols-3 gap-5">
          {properties.map((property) => (
            <PropertyCard property={property} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

const PropertyCardMenu = () => (
  <div class="flex justify-center mb-4">
    <select class="select select-bordered max-w-xs m-2">
      <option disabled selected>
        Availability
      </option>
      <option>All</option>
      <option>Available</option>
      <option>Locked</option>
    </select>
    <select class="select select-bordered max-w-xs m-2">
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

const Content = () => (
  <>
    <Hero />
    <PropertyCards />
  </>
);

const Layout = () => (
  <div class="drawer min-h-screen">
    <input id="navbar-drawer" type="checkbox" class="drawer-toggle" />
    <div class="flex flex-col drawer-content">
      <div class="w-full navbar bg-base-200 shadow-lg">
        <div class="flex-none lg:hidden">
          <label for="navbar-drawer" class="btn btn-square btn-ghost">
            <DrawerIcon />
          </label>
        </div>
        <div class="px-2 mx-2 navbar-start">
          <span>Renter.Cafe</span>
        </div>
        <div class="hidden px-2 mx-2 navbar-center lg:flex">
          <div class="flex items-stretch">
            <a class="btn btn-ghost rounded-btn">Yield</a>
            <a class="btn btn-ghost rounded-btn">Properties</a>
          </div>
        </div>
        <div class="navbar-end">
          <button class="btn btn-primary">Connect wallet</button>
        </div>
      </div>
      <Content />
    </div>
    <div class="drawer-side">
      <label for="navbar-drawer" class="drawer-overlay" />
      <ul class="p-4 overflow-y-auto menu w-80 bg-base-100">
        <li>
          <a>Yield</a>
        </li>
        <li>
          <a>Properties</a>
        </li>
      </ul>
    </div>
  </div>
);

export function App() {
  return (
    <>
      <Layout />
    </>
  );
}
