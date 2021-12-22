import type { ExternalProvider } from "@ethersproject/providers";

/// <reference types="vite/client" />
declare global {
  interface Window {
    ethereum?: ExternalProvider & {
      chainId: string;

      on<K extends EventKeys>(event: K, eventHandler: EventHandler<K>): void;
    };
  }
}

declare module "teaful" {
  import React from "react";
  type Hook<S> = (
    initial?: S,
    onAfterUpdate?: afterCallbackType<S>
  ) => HookReturn<S>;

  type HookDry<S> = (initial?: S) => HookReturn<S>;

  type HookReturn<T> = [T, (value: T) => void, () => {}];

  export type Hoc<S> = { store: HookReturn<S> };

  type HocFunc<S, R extends React.ComponentClass = React.ComponentClass> = (
    component: R,
    initial?: S
  ) => R;

  type useStoreType<S extends initialType> = {
    [k in keyof S]: S[k] extends initialType ? useStoreType<S[k]> : Hook<S[k]>;
  };

  type getStoreType<S extends initialType> = {
    [k in keyof S]: S[k] extends initialType
      ? useStoreType<S[k]>
      : HookDry<S[k]>;
  };

  type withStoreType<S extends initialType> = {
    [k in keyof S]: S[k] extends initialType ? withStoreType<S[k]> : HocFunc<S>;
  };

  type initialType = Record<string, any>;

  type afterCallbackType<S extends initialType> = (param: {
    store: S;
    prevStore: S;
  }) => void;

  function createStore<S extends initialType>(
    initial: S,
    afterCallback?: afterCallbackType<S>
  ): {
    useStore: Hook<S> & useStoreType<S>;
    getStore: HookDry<S> & getStoreType<S>;
    withStore: HocFunc<S> & withStoreType<S>;
  };

  export default createStore;
}
