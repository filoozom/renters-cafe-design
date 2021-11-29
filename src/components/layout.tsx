import { useEffect, useState } from "preact/hooks";
import { ethers } from "ethers";
import { Link } from "@reach/router";
import classnames from "classnames";
import { differenceInMilliseconds } from "date-fns";

import type { ComponentChildren } from "preact";

import { DrawerIcon } from "./icons/drawer";
import { TwitterIcon } from "./icons/twitter";
import { DiscordIcon } from "./icons/discord";
import { Logo } from "./logo";

import { useStore } from "../store";

// Config
import { onlyHome, releaseDate, simulateLaunched } from "../../config/default";
import { Alerts } from "./alerts/alerts";

const WalletButton = () => {
  const { ethereum } = window;
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();

  const [address, setAddress] = useStore.address();
  const [loading, setLoading] = useState<boolean>(false);

  const connectWallet = async () => {
    if (loading || address) {
      return;
    }

    setLoading(true);
    try {
      await provider.send("eth_requestAccounts", []);
    } catch (err) {}
    setLoading(false);
  };

  // Fetch current logged-in address
  useEffect(() => {
    signer
      .getAddress()
      .then(setAddress)
      .catch(() => {});

    const handler = (accounts: string[]) => {
      setAddress(accounts[0]);
    };

    ethereum.on("accountsChanged", handler);
    return () => {
      provider?.removeListener("accountsChanged", handler);
    };
  }, []);

  return (
    <button
      class={classnames(
        "btn",
        "btn-primary",
        "normal-case",
        loading && ["btn-disabled", "loading"]
      )}
      onClick={connectWallet}
    >
      {loading
        ? "Connecting..."
        : address
        ? `${address.slice(0, 6)}...${address.slice(-4)}`
        : "Connect Wallet"}
    </button>
  );
};

type LayoutProps = {
  children: ComponentChildren;
};

export const Layout = ({ children }: LayoutProps) => {
  const [launched, setLaunched] = useState(false);
  const showLinks = simulateLaunched || (launched && !onlyHome);

  useEffect(() => {
    const run = () => {
      const difference = differenceInMilliseconds(releaseDate, new Date());
      if (difference < 0) {
        setLaunched(true);
      } else {
        setTimeout(run, difference);
      }
    };
    run();
  }, [releaseDate]);

  return (
    <div class="drawer min-h-screen">
      <input id="navbar-drawer" type="checkbox" class="drawer-toggle" />
      <div class="flex flex-col drawer-content h-full">
        <div class="w-full navbar bg-base-200 shadow-lg flex-initial">
          <div class="flex-none sm:hidden">
            <label for="navbar-drawer" class="btn btn-square btn-ghost">
              <DrawerIcon />
            </label>
          </div>
          <div class="navbar-start sm:ml-2">
            <Logo />
            <span class="ml-2 sm:block hidden">Renter.Cafe</span>
          </div>
          <div class="hidden px-2 mx-2 navbar-center sm:flex">
            <div class="flex items-stretch">
              {showLinks && (
                <>
                  <Link className="btn btn-ghost rounded-btn" to="/">
                    Yield
                  </Link>
                  <Link className="btn btn-ghost rounded-btn" to="/auctions">
                    Auctions
                  </Link>
                  <Link className="btn btn-ghost rounded-btn" to="/stealing">
                    Stealing
                  </Link>
                </>
              )}
              <a
                className="btn btn-ghost rounded-btn"
                href="https://docs.renter.cafe/"
                target="_blank"
              >
                Docs
              </a>
            </div>
          </div>
          {showLinks && (
            <div class="navbar-end">
              <WalletButton />
            </div>
          )}
        </div>
        <div class="flex-auto">{children}</div>
        <footer class="flex items-center p-4 bg-neutral text-neutral-content justify-between flex-initial">
          <p>No rights reserved :-)</p>
          <div class="flex gap-4">
            <a target="_blank" href="https://twitter.com/rentercafe">
              <TwitterIcon />
            </a>
            <a target="_blank" href="https://discord.gg/8C52Auxz">
              <DiscordIcon />
            </a>
          </div>
        </footer>
      </div>
      <div class="drawer-side">
        <label for="navbar-drawer" class="drawer-overlay" />
        <ul class="p-4 overflow-y-auto menu w-80 bg-base-100">
          {showLinks && (
            <>
              <li>
                <Link to="/">Yield</Link>
              </li>
              <li>
                <Link to="/auctions">Auctions</Link>
              </li>
              <li>
                <Link to="/stealing">Stealing</Link>
              </li>
            </>
          )}
          <li>
            <a href="https://docs.renter.cafe/" target="_blank">
              Docs
            </a>
          </li>
        </ul>
      </div>

      <Alerts />
    </div>
  );
};
