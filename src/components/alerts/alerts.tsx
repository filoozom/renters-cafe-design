import { createContext } from "preact";
import { useContext, useState } from "preact/hooks";
import type { ComponentChildren } from "preact";
import { CloseIcon } from "../icons/close";
import { ErrorIcon } from "../icons/error";

import classes from "./alerts.module.css";

export enum AlertType {
  ERROR,
}

export type Alert = {
  type: AlertType;
  message: string;
};

export type AlertContext = {
  alerts: Alert[];
  addAlert: (alert: Alert) => void;
  removeAlert: (index: number) => void;
};

export const AlertsContext = createContext<AlertContext>({
  alerts: [],
  addAlert: () => {},
  removeAlert: () => {},
});

type AlertsProviderProps = {
  children: ComponentChildren;
};

const errors = {
  [AlertType.ERROR]: "error",
};

export const AlertsProvider = ({ children }: AlertsProviderProps) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const addAlert = (alert: Alert) => setAlerts([alert, ...alerts]);
  const removeAlert = (index: number) =>
    setAlerts(alerts.filter((_, i) => i !== index));

  return (
    <AlertsContext.Provider value={{ alerts, addAlert, removeAlert }}>
      {children}
    </AlertsContext.Provider>
  );
};

export const Alerts = () => {
  const { alerts, removeAlert } = useContext(AlertsContext);

  return (
    <div class="stack absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 bottom-4">
      {alerts.map((alert, i) => (
        <div class={`alert ${classes[errors[alert.type]]}`}>
          <div class="flex-1 pl-4">
            <ErrorIcon />
            <label class="ml-4">{alert.message}</label>
          </div>
          <div class="flex-none">
            <button class="ml-8 btn btn-ghost" onClick={() => removeAlert(i)}>
              <CloseIcon />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
