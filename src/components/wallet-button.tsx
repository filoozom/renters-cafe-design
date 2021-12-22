import { ComponentChildren } from "preact";
import classNames from "classnames";
import { useStore } from "../store";
import { Web3Provider } from "@ethersproject/providers";
import { useContext, useState } from "preact/hooks";
import { AlertsContext, AlertType } from "./alerts/alerts";

type WalletButtonProps = {
  children: ComponentChildren;
  class: string;
  onClick: () => Promise<void>;
  disabled?: boolean;
  pulse?: boolean;
};

export const WalletButton = ({
  children,
  class: className,
  onClick,
  disabled = false,
  pulse = false,
}: WalletButtonProps) => {
  const [address] = useStore.address();
  const [loading, setLoading] = useState(false);
  const { addAlert } = useContext(AlertsContext);
  const { ethereum } = window;

  const doAction = async () => {
    if (loading || disabled || !ethereum) {
      return;
    }

    setLoading(true);
    try {
      if (!address) {
        const provider = new Web3Provider(ethereum);
        await provider.send("eth_requestAccounts", []);
      } else {
        await onClick();
      }
    } catch (err) {
      const message = (err as any)?.data?.message as string;
      if (message) {
        addAlert({ type: AlertType.ERROR, message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      class={classNames(
        className,
        "btn",
        loading && "loading btn-disabled",
        disabled && "btn-disabled",
        pulse && !loading && !disabled && "btn-pulse"
      )}
      onClick={doAction}
    >
      {address ? children : "Connect wallet"}
    </button>
  );
};
