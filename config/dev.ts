export default {
  rpc: {
    http: "https://rpc.renter-cafe.apyos.dev/ext/bc/C/rpc",
    ws: "wss://rpc.renter-cafe.apyos.dev/ext/bc/C/ws",
  },
  cafe: {
    address: "0x1Eb835EB7BEEEE9E6bbFe08F16a2d2eF668204bd",
  },
  propertyAuction: {
    address: "0x993F00eb9C73e3E4eAe3d6Afb4Ba65A6b8B5E597",
  },
  stealableProperties: {
    address: "0x2706A171ECb68E0038378D40Dd1d136361d0cB7d",
  },
  stealAuction: {
    address: "0xd771D7C0e1EBE89C9E9F663824851BB89b926d1a",
  },
  rent: {
    address: "0x0116686E2291dbd5e317F47faDBFb43B599786Ef",
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
  chainId: "0xa868",
  chainName: "Renter.Cafe - Dev",
  nativeCurrency: { name: "AVAX", symbol: "AVAX", decimals: 18 },
  rpcUrls: ["https://rpc.renter-cafe.apyos.dev/ext/bc/C/rpc"],
  blockExplorerUrls: null,
};
