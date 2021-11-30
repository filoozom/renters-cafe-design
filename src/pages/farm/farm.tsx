import { JSX } from "preact";
import { useState, useEffect, useMemo } from "preact/hooks";
import classnames from "classnames";
import type { RouteComponentProps } from "@reach/router";
import { useQuery } from "urql";
import { constants } from "ethers";

import classes from "./farm.module.css";

import type { Pool } from "../../types/pool";
import { CogIcon } from "../../components/icons/cog";
import { Cafe } from "../../lib/contracts/cafe";
import { LP } from "../../lib/contracts/lp";

import { useStore } from "../../store";
import { ERC20 } from "../../lib/contracts/erc20";

import config from "../../../config/default";
import { toBigInt, getProvider } from "../../lib/ethereum";
import { GiftIcon } from "../../components/icons/gift";
import { formatNumber } from "../../lib/tools";
import { WalletButton } from "../../components/wallet-button";

const getMultiplier = (cafe: Cafe, from: bigint, to: bigint) => {
  if (to <= cafe.bonusEndTimestamp) {
    return (to - from) * cafe.bonusMultiplier;
  } else if (from >= cafe.bonusEndTimestamp) {
    return to - from;
  }

  return (
    (cafe.bonusEndTimestamp - from) * cafe.bonusMultiplier +
    to -
    cafe.bonusEndTimestamp
  );
};

const pendingRent = (cafe: Cafe, pool: Pool) => {
  if (!pool.user || !pool.total) {
    return 0n;
  }

  let accRentPerShare = pool.accRentPerShare;

  const to = BigInt(Date.now()) / 1000n;
  const multiplier = getMultiplier(cafe, pool.lastRewardTimestamp, to);
  const reward =
    (multiplier * cafe.rentPerSecond * pool.allocation) / cafe.totalAllocation;

  accRentPerShare += (reward * cafe.accRentPrecision) / pool.total;

  return (
    (pool.user.total * accRentPerShare) / cafe.accRentPrecision - pool.user.debt
  );
};

const FarmQuery = `
  query ($cafe: ID!, $user: String) {
    cafe(id: $cafe) {
      id
      rentPerSecond
      totalAllocation
      withdrawFeePrecision
      accRentPrecision
      bonusEndTimestamp
      bonusMultiplier
      pools {
        id
        token
        total
        allocation
        withdrawFee
        accRentPerShare
        lastRewardTimestamp
        lp {
          id
          name
          symbol
        }
        users(where: { address: $user }) {
          id
          balance
          total
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

type ActionType = "deposit" | "withdraw";

const PoolSettings = ({
  pool,
  refetch,
}: {
  pool: Pool;
  refetch: () => void;
}) => {
  const [address] = useStore.address();
  const [balance, setBalance] = useState<bigint>(0n);
  const [input, setInput] = useState<string>();
  const [action, setAction] = useState<ActionType>("deposit");
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
    const amount = action === "deposit" ? balance : pool?.user?.balance || 0n;
    setInput(((amount * BigInt(percentage)) / 100n).toString());
  };

  const changeInput = ({
    currentTarget,
  }: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    setInput(currentTarget.value);
  };

  const changeAction = (action: ActionType) => {
    setAction(action);
    setInput("");
  };

  const doAction = async () => {
    const amount = BigInt(input || "0");
    const cafe = await Cafe();

    if (action === "deposit") {
      // Check allowance
      const token = await ERC20(pool.token);
      if (!(await token.checkAllowance(config.cafe.address, amount))) {
        const tx = await token.approve(
          config.cafe.address,
          toBigInt(constants.MaxUint256)
        );
        await tx.wait();
      }

      // Initiate deposit
      await cafe.deposit(pool.id, amount);
    } else if (action === "withdraw") {
      await cafe.withdraw(pool.id, amount);
    }

    setInput("0");
    refetch();
  };

  return (
    <tr class={classes.selected}>
      <td colSpan={6} class="p-3 text-center">
        <div class="flex justify-between">
          <div class="btn-group mb-4">
            <button
              onClick={() => changeAction("deposit")}
              class={classnames(
                ...buttonClasses,
                action === "deposit" && "btn-active"
              )}
            >
              Deposit
            </button>
            <button
              onClick={() => changeAction("withdraw")}
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
        <WalletButton class="btn-primary w-full" onClick={doAction}>
          {action}
        </WalletButton>
      </td>
    </tr>
  );
};

const PoolTr = ({
  cafe,
  pool,
  active,
  onSettings,
  rentPerSecond,
  refetch,
  showPendingRent,
}: {
  cafe: Cafe;
  pool: Pool;
  active: boolean;
  onSettings: () => void;
  rentPerSecond: bigint;
  refetch: () => void;
  showPendingRent: boolean;
}) => {
  const bonus =
    Date.now() / 1000 < cafe.bonusEndTimestamp
      ? Number(cafe.bonusMultiplier)
      : 1;
  const rentPrecision = 1e18;
  const rentPerDay =
    ((Number(rentPerSecond) * 60 * 60 * 24) / rentPrecision) * bonus;

  const [pending, setPending] = useState("0");

  useEffect(() => {
    if (!showPendingRent) {
      return;
    }

    const run = () =>
      setPending(formatNumber(Number(pendingRent(cafe, pool)) / 1e18));
    const interval = setInterval(run, 1000);
    run();

    return () => {
      clearInterval(interval);
    };
  }, [cafe, showPendingRent]);

  const harvest = async () => {
    const cafe = await Cafe();
    try {
      await cafe.harvest(pool.id);
      refetch();
    } catch (err) {}
  };

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
        <td class="p-3">{formatNumber(rentPerDay)} RENT / day</td>
        <td class="p-3">123.45%</td>
        {showPendingRent && <td class="p-3">{pending} RENT</td>}
        <td class="p-3 whitespace-nowrap">
          <div
            class={classnames(
              "btn btn-square btn-ghost",
              !showPendingRent && classes.disabled
            )}
          >
            <div
              data-tip={
                showPendingRent
                  ? "Harvest"
                  : "Connect your wallet to unlock harvesting"
              }
              class="tooltip tooltip-top"
              onClick={harvest}
            >
              <GiftIcon />
            </div>
          </div>
          <div class="btn btn-square btn-ghost" onClick={onSettings}>
            <div data-tip="Deposit / withdraw" class="tooltip tooltip-top">
              <CogIcon />
            </div>
          </div>
        </td>
      </tr>
      {active && <PoolSettings pool={pool} refetch={refetch} />}
    </>
  );
};

type FarmPageProps = RouteComponentProps;
type Cafe = {
  rentPerSecond: bigint;
  totalAllocation: bigint;
  withdrawFeePrecision: bigint;
  accRentPrecision: bigint;
  bonusEndTimestamp: bigint;
  bonusMultiplier: bigint;
  pools: [Pool];
};

export const FarmPage = (_: FarmPageProps) => {
  const [address] = useStore.address();
  const [active, setActive] = useState<bigint | null>();
  const changeActive = (id: bigint) => {
    setActive(active === id ? null : id);
  };

  const [result, refresh] = useQuery<{ cafe: Cafe }>({
    query: FarmQuery,
    variables: {
      cafe: config.cafe.address.toLowerCase(),
      user: address || null,
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

  const cafe = useMemo(() => {
    if (!result.data) {
      return null;
    }

    const { cafe: data } = result.data;
    data.pools = data.pools.map((pool) => ({
      ...pool,
      user: (pool as any).users?.[0],
    })) as [Pool];

    return data;
  }, [result.data]);

  if (!cafe) {
    return <p>Loading...</p>;
  }

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
                  {address && <th class="p-3">Pending RENT</th>}
                  <th class="p-3 w-0">Action</th>
                </tr>
              </thead>
              <tbody>
                {cafe.pools.map((pool) => (
                  <PoolTr
                    rentPerSecond={
                      (pool.allocation * cafe.rentPerSecond) /
                      cafe.totalAllocation
                    }
                    cafe={cafe}
                    pool={pool}
                    active={active === pool.id}
                    onSettings={() => changeActive(pool.id)}
                    refetch={refetch}
                    showPendingRent={!!address}
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
