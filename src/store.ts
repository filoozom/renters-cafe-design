import createStore from "teaful";

type Store = {
  address: string | null;
};

export const { useStore, getStore, withStore } = createStore(
  {
    address: null,
  } as Store,
  () => {}
);
