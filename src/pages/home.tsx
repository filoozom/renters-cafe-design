import { Redirect, RouteComponentProps } from "@reach/router";
import { useState } from "preact/hooks";
import classnames from "classnames";

// Hooks
import { useCountdown } from "../hooks/useCountdown";

// Config
import { releaseDate } from "../../config";

const ConnectWallet = () => {
  const [open, setOpen] = useState(false);

  const connect = async () => {
    setOpen(true);
  };

  return (
    <>
      <button class="btn btn-primary" onClick={connect}>
        Connect wallet
      </button>
      <div class={classnames("modal", open && "modal-open")}>
        <div class="modal-box">
          <p class="text-neutral text-justify">
            Renter Cafe hasn't launched yet, but be sure to come back on January
            3rd!
          </p>
          <div class="modal-action">
            <button class="btn" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const isDone = (duration: Duration | undefined) => {
  if (!duration) {
    return false;
  }

  let sum = 0;
  const keys = [
    "years",
    "months",
    "weeks",
    "days",
    "hours",
    "minutes",
    "seconds",
  ] as (keyof Duration)[];

  for (const key of keys) {
    sum += duration?.[key] ?? 0;
  }

  return sum === 0;
};

const Hero = () => {
  const countdown = useCountdown(releaseDate);
  if (isDone(countdown)) {
    return <Redirect noThrow to="/farm" />;
  }

  return (
    <div class="hero bg-gradient-to-br from-primary to-accent h-full">
      <div class="text-center hero-content text-accent-content">
        <div class="max-w-lg">
          <h1 class="mb-8 text-5xl font-bold">Welcome to Renters.cafe</h1>
          <p class="mb-8">
            Whether you are a fan of yield farming, NFTs, or just looking for a
            token to buy and hodl, we have something for you. So come on in and
            check out our open houses as soon as the countdown expires!
          </p>
          <div class="grid grid-flow-col gap-5 text-center auto-cols-max mb-8 justify-center">
            <div class="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
              <span class="font-mono text-5xl countdown">
                <span style={{ "--value": countdown?.days }}></span>
              </span>
              days
            </div>
            <div class="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
              <span class="font-mono text-5xl countdown">
                <span style={{ "--value": countdown?.hours }}></span>
              </span>
              hours
            </div>
            <div class="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
              <span class="font-mono text-5xl countdown">
                <span style={{ "--value": countdown?.minutes }}></span>
              </span>
              min
            </div>
            <div class="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
              <span class="font-mono text-5xl countdown">
                <span style={{ "--value": countdown?.seconds }}></span>
              </span>
              sec
            </div>
          </div>

          <ConnectWallet />
        </div>
      </div>
    </div>
  );
};

type HomePageProps = RouteComponentProps;

export const HomePage = (_: HomePageProps) => <Hero />;
