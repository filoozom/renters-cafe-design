import { JSX } from "preact";
import { useState, useEffect, useMemo, useCallback } from "preact/hooks";
import classnames from "classnames";
import type { RouteComponentProps } from "@reach/router";
import { useQuery } from "urql";
import { MaxUint256, NegativeOne, Zero } from "@ethersproject/constants";
import { BigNumber } from "@ethersproject/bignumber";

// @ts-ignore: quick fix
import classes from "./farm.module.css";

import type { Finance, Pool, Token } from "../../types/pool";
import { SwitchIcon } from "../../components/icons/switch";
import { Cafe as CafeContract } from "../../lib/contracts/cafe";
import { LP } from "../../lib/contracts/lp";

import { useStore } from "../../store";
import { ERC20 } from "../../lib/contracts/erc20";

import config from "../../../config";
import { getProvider } from "../../lib/ethereum";
import { GiftIcon } from "../../components/icons/gift";
import { formatNumber, withPreventPropagation } from "../../lib/tools";
import { WalletButton } from "../../components/wallet-button";
import { Loading } from "../../components/loading";
import { Disclaimer } from "../../components/disclaimer";

type Cafe = {
  rentPerSecond: BigNumber;
  totalAllocation: BigNumber;
  withdrawFeePrecision: BigNumber;
  accRentPrecision: BigNumber;
  bonusEndTimestamp: BigNumber;
  bonusMultiplier: BigNumber;
  pools: [Pool];
};

const getMultiplier = (cafe: Cafe, from: BigNumber, to: BigNumber) => {
  if (to.lte(cafe.bonusEndTimestamp)) {
    return to.sub(from).mul(cafe.bonusMultiplier);
  } else if (from.gte(cafe.bonusEndTimestamp)) {
    return to.sub(from);
  }

  return cafe.bonusEndTimestamp
    .sub(from)
    .mul(cafe.bonusMultiplier)
    .add(to)
    .sub(cafe.bonusEndTimestamp);
};

const pendingRent = (cafe: Cafe, pool: Pool) => {
  if (!pool.user || !pool.total) {
    return 0n;
  }

  const to = BigNumber.from(Date.now()).div(1000);
  const multiplier = getMultiplier(cafe, pool.lastRewardTimestamp, to);

  // NOTE: This happens when the Cafe hasn't started yet
  if (multiplier.lt(Zero)) {
    return Zero;
  }

  const reward = multiplier
    .mul(cafe.rentPerSecond)
    .mul(pool.allocation)
    .div(cafe.totalAllocation);

  const accRentPerShare = pool.accRentPerShare.add(
    reward.mul(cafe.accRentPrecision).div(pool.total)
  );

  return pool.user.total
    .mul(accRentPerShare)
    .div(cafe.accRentPrecision)
    .sub(pool.user.debt);
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

const getPoolType = (pool: Pool) =>
  pool.lp.name in config.lps.nameToType
    ? (config.lps.nameToType as any)[pool.lp.name]
    : "Unknown";

const getPoolInfo = (pool: Pool) => {
  return pool.lp.id in config.lps.info && (config.lps.info as any)[pool.lp.id];
};

const getPoolName = (pool: Pool) => {
  return getPoolInfo(pool)?.name ?? pool.lp.name;
};

const getTokenImage = (address: string) => {
  return `https://github.com/renter-cafe/joe-tokenlists/raw/add-rent-logo/logos/${address}/logo.png`;
};

const Hero = () => (
  <div class="hero py-32 bg-gradient-to-br from-primary to-accent">
    <div class="text-center hero-content text-accent-content">
      <div class="max-w-lg">
        <h1 class="mb-8 text-5xl font-bold">Yield Farming</h1>
        <p>
          Farming and collecting NFTs was never so intense!
          <br />
          Mint or steal it! Make it yours!
        </p>
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
  const [balance, setBalance] = useState(Zero);
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
    const amount = action === "deposit" ? balance : pool?.user?.balance || Zero;
    setInput(amount.mul(percentage).div(100).toString());
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
    const amount = BigNumber.from(input || "0");
    const cafe = await CafeContract();

    if (action === "deposit") {
      // Check allowance
      const token = await ERC20(pool.token);
      if (!(await token.checkAllowance(config.cafe.address, amount))) {
        const tx = await token.approve(config.cafe.address, MaxUint256);
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
  refetch,
  showPendingRent,
}: {
  cafe: Cafe;
  pool: Pool;
  active: boolean;
  onSettings: () => void;
  refetch: () => void;
  showPendingRent: boolean;
}) => {
  const bonus =
    Date.now() / 1000 < Number(cafe.bonusEndTimestamp)
      ? Number(cafe.bonusMultiplier)
      : 1;
  const rentPrecision = 1e18;
  const rentPerDay =
    ((Number(pool.finance.rentPerSecond) * 60 * 60 * 24) / rentPrecision) *
    bonus;

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
    const cafe = await CafeContract();
    try {
      await cafe.harvest(pool.id);
      refetch();
    } catch (err) {}
  };

  const info = getPoolInfo(pool);

  return (
    <>
      <tr
        class={classnames("cursor-pointer", active && classes.selected)}
        onClick={onSettings}
      >
        <td class="p-3 flex items-center">
          <div class="-space-x-4 avatar-group">
            <div class={`avatar w-12 h-12 ${classes.icon}`}>
              <img src={getTokenImage(info.tokens[0])} />
            </div>
            <div class={`avatar w-12 h-12 ${classes.icon}`}>
              <img src={getTokenImage(info.tokens[1])} />
            </div>
          </div>
          <div class="ml-2 text-left">
            <strong>{info.name}</strong>
            <br />
            {getPoolType(pool)} Pool
          </div>
        </td>
        <td class="p-3">${formatNumber(pool.finance?.tvl || 0)}</td>
        <td class="p-3">{formatNumber(rentPerDay)} RENT / day</td>
        <td class="p-3">
          {pool.finance?.apr ? formatNumber(100 * pool.finance.apr) : "∞"}%
        </td>
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
              onClick={withPreventPropagation(harvest)}
            >
              <GiftIcon />
            </div>
          </div>
          <div
            class="btn btn-square btn-ghost"
            onClick={withPreventPropagation(onSettings)}
          >
            <div data-tip="Deposit / withdraw" class="tooltip tooltip-top">
              <SwitchIcon />
            </div>
          </div>
        </td>
      </tr>
      {active && <PoolSettings pool={pool} refetch={refetch} />}
    </>
  );
};

type FarmPageProps = RouteComponentProps;

const useCafeData = (address: string | null): [Cafe | null, () => void] => {
  const [result, refresh] = useQuery<{ cafe: Cafe }>({
    query: FarmQuery,
    variables: {
      cafe: config.cafe.address.toLowerCase(),
      user: address || null,
    },
  });

  const refetch = useCallback(
    (force = false) => {
      if (!force && result.fetching) {
        return;
      }

      refresh({ requestPolicy: "network-only" });
    },
    [refresh, result.fetching]
  );

  return [result.data?.cafe ?? null, refetch];
};

const UpstreamQuery = `
  query ($cafe: ID!, $pairs: [ID!]!) {
    pairs(where: { id_in: $pairs }) {
      id
      token0 {
        id
        symbol
      }
      token1 {
        id
        symbol
      }
      token0Price
      token1Price
    }
    user(id: $cafe) {
      id
      liquidityPositions {
        id
        liquidityTokenBalance
        pair {
          id
          reserveUSD
          totalSupply
        }
      }
    }
  }
`;

const useUpstreamData = (cafe: Cafe | null) => {
  const pairs = cafe?.pools.map((pool) => pool.token) ?? [];
  const [result] = useQuery<{ pairs: Pair[]; user: User }>({
    query: UpstreamQuery,
    variables: {
      cafe: config.cafe.address.toLocaleLowerCase(),
      pairs,
    },
    context: useMemo(
      () => ({
        url: "https://api.thegraph.com/subgraphs/name/traderjoe-xyz/exchange",
      }),
      []
    ),
  });

  return useMemo(() => {
    if (!result.data) {
      return null;
    }

    let rentPrice;

    const pairs = new Map<string, Pair>();
    for (const pair of result.data.pairs) {
      pairs.set(pair.id, pair);

      // RENT-USDT.e
      if (pair.id === "0x7a66ac439cd568114020abc4fcbefea36947d534") {
        rentPrice = parseFloat(pair.token1Price);
      }
    }

    const tvls = new Map<string, number>();
    for (const lp of result.data.user?.liquidityPositions ?? []) {
      tvls.set(
        lp.pair.id,
        (parseFloat(lp.liquidityTokenBalance) /
          parseFloat(lp.pair.totalSupply)) *
          parseFloat(lp.pair.reserveUSD)
      );
    }

    return { pairs, tvls, rentPrice };
  }, [result.data]);
};

const useBlockNumberChange = (onChange: () => void) => {
  useEffect(() => {
    const provider = getProvider("ws");
    provider.on("block", onChange);
    return () => {
      provider.off("block", onChange);
    };
  }, [onChange]);
};

type LiquidityPair = {
  id: string;
  reserveUSD: string;
  totalSupply: string;
};

type LiquidityPosition = {
  id: string;
  liquidityTokenBalance: string;
  pair: LiquidityPair;
};

type User = {
  id: string;
  liquidityPositions: LiquidityPosition[];
};

type Pair = {
  id: string;
  token0: Token;
  token1: Token;
  token0Price: string;
  token1Price: string;
};

type UseCleanCafeDataProps = {
  cafe: Cafe | null;
  upstream: {
    pairs: Map<string, Pair>;
    tvls: Map<string, number>;
  } | null;
};

const useCleanCafeData = ({ cafe, upstream }: UseCleanCafeDataProps) => {
  return useMemo(() => {
    if (!cafe) {
      return null;
    }

    cafe.pools = cafe.pools.map((pool) => {
      const tvl = upstream?.tvls.get(pool.token);
      const finance: Finance = {
        rentPerSecond: pool.allocation
          .mul(cafe.rentPerSecond)
          .div(cafe.totalAllocation),
      };

      if (tvl) {
        finance.tvl = tvl;
        finance.apr =
          (Number(finance.rentPerSecond) / 1e18 / tvl) * (60 * 60 * 24 * 365);
      }

      return {
        ...pool,
        user: (pool as any).users?.[0],
        info: upstream?.pairs.get(pool.token),
        finance,
      };
    }) as [Pool];

    return cafe;
  }, [cafe, upstream]);
};

const useFarmPageData = (address: string | null): [Cafe | null, () => void] => {
  const [cafe, refetch] = useCafeData(address);
  const upstream = useUpstreamData(cafe);

  useBlockNumberChange(() => refetch());

  return [useCleanCafeData({ cafe, upstream }), refetch];
};

export const FarmPage = (_: FarmPageProps) => {
  const [address] = useStore.address();
  const [active, setActive] = useState(NegativeOne);
  const changeActive = (id: BigNumber) => {
    setActive(active.eq(id) ? NegativeOne : id);
  };

  const [cafe, refetch] = useFarmPageData(address);

  if (!cafe) {
    return (
      <>
        <Hero />
        <Loading />
      </>
    );
  }

  return (
    <>
      <Hero />
      <div class="hero">
        <div class="max-w-5xl mx-auto text-center hero-content">
          <div class="overflow-auto lg:overflow-visible">
            <Disclaimer />
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
                    cafe={cafe}
                    pool={pool}
                    active={active.eq(pool.id)}
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
