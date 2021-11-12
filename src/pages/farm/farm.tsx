import { useState } from "preact/hooks";
import classnames from "classnames";
import type { RouteComponentProps } from "@reach/router";

import classes from "./farm.module.css";

import { CogIcon } from "../../components/icons/cog";

type Pool = {
  type: "Trader Joe";
  id: number;
  token: string;
  allocation: number;
  balance: number;
  tokens: {
    address: string;
    name: string;
  }[];
};

const pools: Pool[] = [
  {
    type: "Trader Joe",
    id: 0,
    token: "0x0",
    allocation: 100,
    balance: 0,
    tokens: [
      {
        address: "0x0",
        name: "RENT",
      },
      {
        address: "0x0",
        name: "JOE",
      },
    ],
  },
  {
    type: "Trader Joe",
    id: 1,
    token: "0x0",
    allocation: 100,
    balance: 0,
    tokens: [
      {
        address: "0x0",
        name: "RENT",
      },
      {
        address: "0x0",
        name: "WAVAX",
      },
    ],
  },
  {
    type: "Trader Joe",
    id: 2,
    token: "0x0",
    allocation: 100,
    balance: 0,
    tokens: [
      {
        address: "0x0",
        name: "RENT",
      },
      {
        address: "0x0",
        name: "USDT.e",
      },
    ],
  },
  {
    type: "Trader Joe",
    id: 3,
    token: "0x0",
    allocation: 100,
    balance: 0,
    tokens: [
      {
        address: "0x0",
        name: "RENT",
      },
      {
        address: "0x0",
        name: "WBTC.e",
      },
    ],
  },
  {
    type: "Trader Joe",
    id: 4,
    token: "0x0",
    allocation: 10,
    balance: 0,
    tokens: [
      {
        address: "0x0",
        name: "MIM",
      },
      {
        address: "0x0",
        name: "TIME",
      },
    ],
  },
  {
    type: "Trader Joe",
    id: 5,
    token: "0x0",
    allocation: 10,
    balance: 0,
    tokens: [
      {
        address: "0x0",
        name: "WAVAX",
      },
      {
        address: "0x0",
        name: "TIME",
      },
    ],
  },
  {
    type: "Trader Joe",
    id: 6,
    token: "0x0",
    allocation: 10,
    balance: 0,
    tokens: [
      {
        address: "0x0",
        name: "USDC.e",
      },
      {
        address: "0x0",
        name: "USDT.e",
      },
    ],
  },
];

const getPoolName = (pool: Pool) =>
  pool.tokens.map(({ name }) => name).join("-");

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

const Property = ({ pool }: { pool: Pool }) => {
  return (
    <div class="card bordered shadow">
      <div class="flex items-center justify-center space-x-2 m-4">
        <div>
          <div class="-space-x-6 avatar-group">
            <div class={classes.avatar}>
              <div class="w-12 h-12">
                <img src="https://res.cloudinary.com/sushi-cdn/image/fetch/w_96/https://raw.githubusercontent.com/sushiswap/logos/main/network/ethereum/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599.jpg" />
              </div>
            </div>
            <div class={classes.avatar}>
              <div class="w-12 h-12">
                <img src="https://res.cloudinary.com/sushi-cdn/image/fetch/w_96/https://raw.githubusercontent.com/sushiswap/icons/master/token/eth.jpg" />
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="text-lg font-extrabold">
            {pool.tokens.map(({ name }) => name).join("-")}
          </div>
          <div class="text-sm text-base-content text-opacity-60">
            {pool.type} Farm
          </div>
        </div>
      </div>
      <div class="card-body text-left p-4">
        <div class="flex justify-between">
          <span>TVL</span>
          <span>$123,456,789</span>
        </div>
        <div class="flex justify-between">
          <span>Rewards</span>
          <span>5 RENT/day</span>
        </div>
        <div class="flex justify-between">
          <span>APR</span>
          <span>98.87%</span>
        </div>
        <div class="justify-end card-actions">
          <button class="btn btn-secondary">Steal</button>
        </div>
        <div class="alert">
          <div class="flex-1">
            <label class="mx-3">Pending</label>
          </div>
          <div class="flex-1">
            <span class="mx-3">200 RENT</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Menu = () => (
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

const Pools = () => (
  <div class="hero">
    <div class="max-w-5xl mx-auto text-center hero-content">
      <div>
        <Menu />
        <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
          {pools.map((pool) => (
            <Property pool={pool} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

const PoolSettings = ({ pool }: { pool: Pool }) => {
  const [action, setAction] = useState<"deposit" | "withdraw">("deposit");
  const buttonClasses = ["btn", "btn-outline", "btn-sm"];

  return (
    <tr class={classes.selected}>
      <td colSpan={5} class="p-3 text-center">
        <div class="flex justify-between">
          <div class="btn-group mb-4">
            <button
              onClick={() => setAction("deposit")}
              class={classnames(
                ...buttonClasses,
                action === "deposit" && "btn-active"
              )}
            >
              Deposit
            </button>
            <button
              onClick={() => setAction("withdraw")}
              class={classnames(
                ...buttonClasses,
                action === "withdraw" && "btn-active"
              )}
            >
              Withdraw
            </button>
          </div>
          <div class="btn-group mb-4">
            <button class="btn btn-outline btn-sm">25%</button>
            <button class="btn btn-outline btn-sm">50%</button>
            <button class="btn btn-outline btn-sm">75%</button>
            <button class="btn btn-outline btn-sm">100%</button>
          </div>
        </div>
        <label class="input-group mb-4">
          <input
            type="text"
            placeholder="Amount"
            class="input input-bordered w-full"
          />
          <span class="whitespace-nowrap">{getPoolName(pool)}</span>
        </label>
        <button class="btn btn-primary w-full">{action}</button>
      </td>
    </tr>
  );
};

const PoolTr = ({
  pool,
  active,
  onSettings,
}: {
  pool: Pool;
  active: boolean;
  onSettings: () => void;
}) => (
  <>
    <tr class={`${active ? classes.selected : ""}`}>
      <td class="p-3 flex items-center">
        <div class="-space-x-6 avatar-group">
          <div class={`avatar ${classes.icon}`}>
            <div class="w-12 h-12">
              <img src="https://res.cloudinary.com/sushi-cdn/image/fetch/w_96/https://raw.githubusercontent.com/sushiswap/logos/main/network/ethereum/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599.jpg" />
            </div>
          </div>
          <div class={`avatar ${classes.icon}`}>
            <div class="w-12 h-12">
              <img src="https://res.cloudinary.com/sushi-cdn/image/fetch/w_96/https://raw.githubusercontent.com/sushiswap/icons/master/token/eth.jpg" />
            </div>
          </div>
        </div>
        <div class="ml-2 text-left">
          <strong>{getPoolName(pool)}</strong>
          <br />
          {pool.type} Pool
        </div>
      </td>
      <td class="p-3">$123,456,789</td>
      <td class="p-3">123 RENT / day</td>
      <td class="p-3">123.45%</td>
      <td class="p-3">
        <div class="btn btn-square btn-ghost" onClick={onSettings}>
          <CogIcon />
        </div>
      </td>
    </tr>
    {active && <PoolSettings pool={pool} />}
  </>
);

type FarmPageProps = RouteComponentProps;

export const FarmPage = (_: FarmPageProps) => {
  const [active, setActive] = useState<number | null>();
  const changeActive = (id: number) => {
    setActive(active === id ? null : id);
  };

  return (
    <>
      <Hero />
      <div class="hero">
        <div class="max-w-5xl mx-auto text-center hero-content">
          <div class="overflow-auto lg:overflow-visible ">
            <table
              class={`border-separate space-y-6 text-center ${classes.table}`}
            >
              <thead>
                <tr>
                  <th class="p-3">Pool</th>
                  <th class="p-3">TVL</th>
                  <th class="p-3">Rewards</th>
                  <th class="p-3">APR</th>
                  <th class="p-3 w-0">Action</th>
                </tr>
              </thead>
              <tbody>
                {pools.map((pool) => (
                  <PoolTr
                    pool={pool}
                    active={active === pool.id}
                    onSettings={() => changeActive(pool.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
