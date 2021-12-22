import type { ComponentChildren } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import { Link } from "@reach/router";
import classnames from "classnames";
import { differenceInMilliseconds } from "date-fns";

// Store
import { useStore } from "../store";

// Lib
import { getEthereum } from "../lib/ethereum";

// Config
import { releaseDate, simulateLaunched, chain } from "../../config";
import { Alerts } from "./alerts/alerts";

// Components
import { AlertsContext, AlertType } from "./alerts/alerts";
import { ExclamationIcon } from "./icons/exclamation";

// Icons
import { DrawerIcon } from "./icons/drawer";
import { TwitterIcon } from "./icons/twitter";
import { DiscordIcon } from "./icons/discord";
import { TelegramIcon } from "./icons/telegram";
import { GitHubIcon } from "./icons/github";
import { Logo } from "./logo";

// Constants
const ICONS = [
  {
    Icon: TwitterIcon,
    url: "https://twitter.com/rentercafe",
  },
  {
    Icon: DiscordIcon,
    url: "https://discord.gg/RPZNtweHEF",
  },
  {
    Icon: TelegramIcon,
    url: "https://t.co/HDGcX3S9Ov",
  },
  {
    Icon: GitHubIcon,
    url: "https://github.com/renter-cafe",
  },
];

const MENU = [
  {
    text: "Yield",
    url: "/",
  },
  {
    text: "Auctions",
    url: "/auctions",
  },
  {
    text: "Stealing",
    url: "/stealing",
  },
];

const WalletButton = () => {
  const { ethereum, provider, signer } = getEthereum();
  const [address, setAddress] = useStore.address();
  const [loading, setLoading] = useState<boolean>(false);

  const connectWallet = async () => {
    if (loading || address || !provider) {
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
    if (!signer || !ethereum) {
      // TODO: Add "install MetaMask" popup
      return;
    }

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

const WrongNetworkButton = () => {
  const { ethereum, provider } = getEthereum();
  const [chainId, setChainId] = useState<string | undefined>(ethereum?.chainId);
  const { addAlert } = useContext(AlertsContext);

  useEffect(() => {
    ethereum?.on("chainChanged", setChainId);
    return () => {
      provider?.removeListener("chainChanged", setChainId);
    };
  }, []);

  if (chainId === chain.chainId) {
    return null;
  }

  if (chainId === undefined) {
    // TODO: Show popup to install MetaMask
  }

  const switchNetwork = async () => {
    if (!ethereum) {
      return;
    }

    try {
      await ethereum.request?.({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chain.chainId }],
      });
    } catch (err: any) {
      if (err.code === 4902) {
        try {
          await ethereum.request?.({
            method: "wallet_addEthereumChain",
            params: [chain],
          });
        } catch (err: any) {
          addAlert({
            type: AlertType.ERROR,
            message: err?.message,
          });
        }
        return;
      }

      addAlert({
        type: AlertType.ERROR,
        message: err?.message,
      });
    }

    ethereum?.request?.({
      method: "wallet_addEthereumChain",
      params: [chain],
    });
  };

  return (
    <div data-tip="Wrong network" class="tooltip tooltip-bottom mr-2">
      <button
        class="btn btn-primary"
        style={{
          "--tw-bg-opacity": 0.7,
          "--tw-border-opacity": 0.7,
        }}
        onClick={switchNetwork}
      >
        <ExclamationIcon />
      </button>
    </div>
  );
};

type LayoutProps = {
  children: ComponentChildren;
  onlyHome?: boolean;
};

export const Layout = ({ children, onlyHome = false }: LayoutProps) => {
  const [launched, setLaunched] = useState(false);
  const showLinks = !onlyHome && (simulateLaunched || launched);

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
            <Link className="flex items-center" to="/">
              <Logo />
              <span class="ml-2 sm:block hidden">Renter.Cafe</span>
            </Link>
          </div>
          <div class="hidden px-2 mx-2 navbar-center sm:flex">
            <div class="flex items-stretch">
              {showLinks &&
                MENU.map(({ text, url }) => (
                  <Link className="btn btn-ghost rounded-btn" to={url}>
                    {text}
                  </Link>
                ))}
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
              <WrongNetworkButton />
              <WalletButton />
            </div>
          )}
        </div>
        <div class="flex-auto">{children}</div>
        <footer class="flex items-center p-4 bg-neutral text-neutral-content justify-between flex-initial flex-col sm:flex-row">
          <p>No rights reserved :-)</p>
          <div class="flex gap-4">
            {ICONS.map(({ Icon, url }) => (
              <a class="flex items-center" target="_blank" href={url}>
                <Icon />
              </a>
            ))}
          </div>
        </footer>
      </div>
      <div class="drawer-side">
        <label for="navbar-drawer" class="drawer-overlay" />
        <ul class="p-4 overflow-y-auto menu w-80 bg-base-100">
          {showLinks &&
            MENU.map(({ text, url }) => (
              <li>
                <Link to={url}>{text}</Link>
              </li>
            ))}
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
