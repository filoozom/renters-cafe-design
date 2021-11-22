import { JSX } from "preact";
import { useState, useEffect } from "preact/hooks";
import classnames from "classnames";
import type { RouteComponentProps } from "@reach/router";
import { useQuery } from "urql";
import { constants } from "ethers";

import classes from "./farm.module.css";

import type { Pool } from "../../types/pool";
import { CogIcon } from "../../components/icons/cog";
import { Cafe } from "../../lib/cafe";
import { LP } from "../../lib/lp";

import { useStore } from "../../store";
import { ERC20 } from "../../lib/erc20";

import config from "../../../config/default";
import { toBigInt } from "../../lib/ethereum";

const FarmQuery = `
  query ($cafe: ID!, $user: String!) {
    cafe(id: $cafe) {
      id
      rentPerSecond
      totalAllocation
      withdrawFeePrecision
      pools {
        id
        token
        allocation
        withdrawFee
        lp {
          id
          name
          symbol
        }
        users(where: { address: $user }) {
          balance
          debt
          rentHarvested
        }
      }
    }
  }
`;

/*
const getPoolName = (pool: Pool) =>
  pool.lp.tokens.map(({ symbol }) => symbol).join("-");
*/

const getPoolName = (pool: any) => pool.token.substr(2, 4);

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

const PoolSettings = ({ pool }: { pool: Pool }) => {
  const [address] = useStore.address();
  const [balance, setBalance] = useState<bigint>(0n);
  const [input, setInput] = useState<string>();
  const [action, setAction] = useState<"deposit" | "withdraw">("deposit");
  const buttonClasses = ["btn", "btn-outline", "btn-sm"];
  const percentages = [25, 50, 75, 100];

  useEffect(() => {
    if (!address) {
      return;
    }

    (async () => {
      const lp = await LP(pool.token);
      setBalance(await lp.getBalance(address));
    })();
  }, [pool.token, address]);

  const choosePercentage = (percentage: number) => {
    if (action === "deposit") {
      setInput(((balance * BigInt(percentage)) / 100n).toString());
    }
  };

  const changeInput = ({
    currentTarget,
  }: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    setInput(currentTarget.value);
  };

  const doAction = async () => {
    if (!input) {
      return;
    }

    if (action === "deposit") {
      const amount = BigInt(input);

      // Check allowance
      const token = await ERC20(pool.token);
      if (!(await token.checkAllowance(amount))) {
        await token.approve(
          config.cafe.address,
          toBigInt(constants.MaxUint256)
        );
      }

      console.log(pool.id, amount);

      // Initiate deposit
      const cafe = await Cafe();
      await cafe.deposit(pool.id, amount);
    }
  };

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
            {percentages.map((percentage) => (
              <button
                class="btn btn-outline btn-sm"
                onClick={() => choosePercentage(percentage)}
              >
                {percentage}%
              </button>
            ))}
          </div>
        </div>
        <label class="input-group mb-4">
          <input
            type="text"
            placeholder="Amount"
            class="input input-bordered w-full"
            value={input}
            onChange={changeInput}
          />
          <span class="whitespace-nowrap">{getPoolName(pool)}</span>
        </label>
        <button class="btn btn-primary w-full" onClick={doAction}>
          {action}
        </button>
      </td>
    </tr>
  );
};

const PoolTr = ({
  pool,
  active,
  onSettings,
  rentPerSecond,
}: {
  pool: Pool;
  active: boolean;
  onSettings: () => void;
  rentPerSecond: bigint;
}) => {
  const rentPerDay = (Number(rentPerSecond) * 60 * 60 * 24) / 1e18;
  return (
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
            {pool.lp.type} Pool
          </div>
        </td>
        <td class="p-3">$123,456,789</td>
        <td class="p-3">{Math.round(rentPerDay * 100) / 100} RENT / day</td>
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
};

type FarmPageProps = RouteComponentProps;
type Cafe = {
  rentPerSecond: bigint;
  totalAllocation: bigint;
  withdrawFeePrecision: bigint;
  pools: [Pool];
};

export const FarmPage = (_: FarmPageProps) => {
  const [address] = useStore.address();
  const [active, setActive] = useState<bigint | null>();
  const changeActive = (id: bigint) => {
    setActive(active === id ? null : id);
  };

  const [result] = useQuery<{ cafe: Cafe }>({
    query: FarmQuery,
    variables: {
      cafe: config.cafe.address.toLowerCase(),
      user: address,
    },
  });

  if (!result.data) {
    return <p>Loading...</p>;
  }

  const { cafe } = result.data;
  const { pools } = cafe;

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
                    rentPerSecond={
                      (pool.allocation * cafe.rentPerSecond) /
                      cafe.totalAllocation
                    }
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
