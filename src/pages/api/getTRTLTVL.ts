import axios from 'axios';

const apiUrl = "https://openapi.taptools.io/api/v1/token/pools";

// Pool On-chain IDs
const trtlonchainIDv1pool = "0be55d262b29f564998ff81efe21bdc0022621c12f15af08d0f2ddb1.ccd6ccf11c5eab6a9964bc9a080a506342a4bb037209e100f0be238da7495a9c";
const trtlonchainIDv2pool = "f5808c2c990d86da54bfc97d89cee6efa20cd8461616359478d96b4c.98cd1a0de51bf17c8ae857f72f215c75a447e4d04fa35cb58364e85e476012c3";

const TAPTOOLS_API_KEY = ""; // Input your Taptools API key here.

async function fetchTokenData(onchainID: string) {
  const response = await axios.get(apiUrl, {
    params: { onchainID },
    headers: {
      'x-api-key': TAPTOOLS_API_KEY,
    },
  });
  const poolData = response.data[0];
  return poolData.tokenBLocked;
}

export async function getTrtlTVL() {
  try {
    // Make both API calls
    const [tokenBLocked1, tokenBLocked2] = await Promise.all([
      fetchTokenData(trtlonchainIDv1pool),
      fetchTokenData(trtlonchainIDv2pool),
    ]);

    // Add both tokenB amounts
    const totalAdaLocked = (tokenBLocked1 + tokenBLocked2) * 2;

    return totalAdaLocked;
  } catch (error) {
    console.error("Error fetching token pool data:", error);
    throw new Error('Failed to fetch token pool data');
  }
}
