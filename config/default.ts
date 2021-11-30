export default {
  rpc: {
    http: "http://srv02.apyos.com:9661/ext/bc/C/rpc",
    ws: "ws://srv02.apyos.com:9661/ext/bc/C/ws",
  },
  cafe: {
    address: "0x11f6673e4E2e3b26a5C7C5D39F946741601Ea953",
  },
  propertyAuction: {
    address: "0x8EB06749Dcb368A1B27D4769b46389B882c255b8",
  },
  stealableProperties: {
    address: "0x1E240E4bD97f9F0bef8336aB42877eed6323CC7D",
  },
  stealAuction: {
    address: "0xC3f3d7Ac58FF1843e97952A0c06ED0d63d65Ed74",
  },
  rent: {
    address: "0xADc312C5715201E4A47BeB1EA78419B5e1c9C928",
  },
  lps: {
    nameToType: {
      "Joe LP Token": "Trader Joe",
    },
  },
  subgraph: "http://srv02.apyos.com:8000/subgraphs/name/renter-cafe/cafe",
};

export const simulateLaunched = true;
export const releaseDate = new Date("2021-12-12 17:00:00 GMT+0100");
