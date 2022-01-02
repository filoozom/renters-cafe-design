export default {
  rpc: {
    http: "https://api.avax.network/ext/bc/C/rpc",
    ws: "wss://api.avax.network/ext/bc/C/ws",
  },
  cafe: {
    address: "0x470eF6Fb745d5ED26fC28518240E2849131D6d61",
  },
  propertyAuction: {
    address: "0x5aDcEb7fCCdaBdCdd82c3D6E2833Fb80D0dd45D6",
  },
  stealableProperties: {
    address: "0x11b9B7aC3646cB9d51c4C3C40b18B13A28e84bc8",
  },
  stealAuction: {
    address: "0x5917df223b1114E79aCb6489882a60eB8158EbF5",
  },
  rent: {
    address: "0x60dfeac9d2a7b76c8a800ed5965cbfae3aaead27",
  },
  lps: {
    nameToType: {
      "Joe LP Token": "Trader Joe",
    },
  },
  subgraph:
    "https://graphs.renter-cafe.apyos.dev/subgraphs/name/renter-cafe/cafe",
};

export const simulateLaunched = true;
export const releaseDate = new Date("2022-01-03 17:00:00 GMT+0100");
export const chain = {
  chainId: "0xa86a",
  chainName: "Avalanche",
  nativeCurrency: { name: "AVAX", symbol: "AVAX", decimals: 18 },
  rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
  blockExplorerUrls: ["https://snowtrace.io/"],
};
