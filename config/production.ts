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
    info: {
      "0xf2a115d5A523589b098eB8391600cdAF13358B8A": {
        name: "RENT-JOE",
        tokens: [
          "0x60DfEAC9d2a7b76C8A800ED5965CBFaE3aAead27",
          "0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd",
        ],
      },
      "0x25c3d75F3A34B57fa2F2821c4b775af5eEFf109A": {
        name: "RENT-WAVAX",
        tokens: [
          "0x60DfEAC9d2a7b76C8A800ED5965CBFaE3aAead27",
          "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
        ],
      },
      "0x7A66aC439Cd568114020ABC4FcbeFeA36947D534": {
        name: "RENT-USDT.e",
        tokens: [
          "0x60DfEAC9d2a7b76C8A800ED5965CBFaE3aAead27",
          "0xc7198437980c041c805A1EDcbA50c1Ce5db95118",
        ],
      },
      "0x113f413371fC4CC4C9d6416cf1DE9dFd7BF747Df": {
        name: "MIM-TIME",
        tokens: [
          "0x130966628846BFd36ff31a822705796e8cb8C18D",
          "0xb54f16fB19478766A268F172C9480f8da1a7c9C3",
        ],
      },
      "0xA389f9430876455C36478DeEa9769B7Ca4E3DDB1": {
        name: "USDC.e-WAVAX",
        tokens: [
          "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664",
          "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
        ],
      },
      "0x781655d802670bbA3c89aeBaaEa59D3182fD755D": {
        name: "MIM-WAVAX",
        tokens: [
          "0x130966628846BFd36ff31a822705796e8cb8C18D",
          "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
        ],
      },
    },
  },
  subgraph: "https://api.thegraph.com/subgraphs/name/renter-cafe/website",
};

export const simulateLaunched = false;
export const releaseDate = new Date("2022-01-03 17:00:00 GMT+0100");
export const chain = {
  chainId: "0xa86a",
  chainName: "Avalanche",
  nativeCurrency: { name: "AVAX", symbol: "AVAX", decimals: 18 },
  rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
  blockExplorerUrls: ["https://snowtrace.io/"],
};
