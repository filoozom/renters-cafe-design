import type { RouteComponentProps } from "@reach/router";
import { useState } from "preact/hooks";
import classnames from "classnames";

// Hooks
import { useCountdown } from "../hooks/useCountdown";

const releaseDate = new Date("2021-12-01");

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
            Renter Cafe hasn't launched yet, but be sure to come back on
            December 1st!
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

const Hero = () => {
  const countdown = useCountdown(releaseDate);

  return (
    <div class="hero p-32 bg-gradient-to-br from-primary to-accent h-full">
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
