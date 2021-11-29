import { ComponentChildren } from "preact";
import classNames from "classnames";
import { useStore } from "../store";
import { providers } from "ethers";
import { useContext, useState } from "preact/hooks";
import { AlertsContext, AlertType } from "./alerts/alerts";

type WalletButtonProps = {
  children: ComponentChildren;
  class: string;
  onClick: () => Promise<void>;
  disabled?: boolean;
};

export const WalletButton = ({
  children,
  class: className,
  onClick,
  disabled = false,
}: WalletButtonProps) => {
  const [address] = useStore.address();
  const [loading, setLoading] = useState(false);
  const { addAlert } = useContext(AlertsContext);

  const doAction = async () => {
    if (loading || disabled) {
      return;
    }

    setLoading(true);
    try {
      if (!address) {
        const { ethereum } = window;
        const provider = new providers.Web3Provider(ethereum);
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
        disabled && "btn-disabled"
      )}
      onClick={doAction}
    >
      {address ? children : "Connect wallet"}
    </button>
  );
};
