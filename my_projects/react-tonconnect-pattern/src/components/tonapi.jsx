// const { Api, HttpClient } = require("@ton-api/client");

// const httpClient = new HttpClient({
//   baseUrl: "https://tonapi.io",
//   baseApiParams: {
//     headers: {
//       Authorization: `Bearer AGI2S5NMZM573CAAAAAA7H6N3CDNHKCHIKNBGJ3D2RSAJPHJCDZ2R3VZPGGMIAOSEEZ4CGI`,
//       "Content-type": "application/json",
//     },
//   },
// });

// const tonapi = new Api(httpClient);

// async function waitForTx(msgHash, attempt = 0) {
//   try {
//     return await tonapi.blockchain.getBlockchainTransactionByMessageHash(
//       msgHash
//     );
//   } catch (e) {
//     if (attempt >= 10) {
//       throw e;
//     }

//     await new Promise((resolve) => setTimeout(resolve, 1500));
//     return waitForTx(msgHash, attempt + 1);
//   }
// }

// async function getJettonWalletAddress(jettonMasterAddress, walletAddress) {
//   const result = await tonapi.blockchain.execGetMethodForBlockchainAccount(
//     jettonMasterAddress,
//     "get_wallet_address",
//     {
//       args: [walletAddress],
//     }
//   );

//   return result.decoded.jetton_wallet_address;
// }

// module.exports = { tonapi, waitForTx, getJettonWalletAddress };

import { TonApiClient } from "@ton-api/client";

const tonapi = new TonApiClient({
  baseUrl: "https://tonapi.io",
  baseApiParams: {
    headers: {
      Authorization: `Bearer AGI2S5NMZM573CAAAAAA7H6N3CDNHKCHIKNBGJ3D2RSAJPHJCDZ2R3VZPGGMIAOSEEZ4CGI`,
      "Content-type": "application/json",
    },
  },
});

async function waitForTx(msgHash, attempt = 0) {
  try {
    return await tonapi.blockchain.getBlockchainTransactionByMessageHash(msgHash);
  } catch (e) {
    if (attempt >= 10) {
      throw e;
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));
    return waitForTx(msgHash, attempt + 1);
  }
}

async function getJettonWalletAddress(jettonMasterAddress, walletAddress) {
  const result = await tonapi.blockchain.execGetMethodForBlockchainAccount(jettonMasterAddress, "get_wallet_address", {
    args: [walletAddress],
  });

  return result.decoded.jetton_wallet_address;
}

// Экспортируем функции
export { tonapi, waitForTx, getJettonWalletAddress };

