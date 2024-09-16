import axios from 'axios';

const apiUrl = "https://openapi.taptools.io/api/v1/token/pools";

const trtlonchainID = "0be55d262b29f564998ff81efe21bdc0022621c12f15af08d0f2ddb1.ccd6ccf11c5eab6a9964bc9a080a506342a4bb037209e100f0be238da7495a9c";

const TAPTOOLS_API_KEY = ""; // Input your Taptools API key here.

export async function getTrtlTVL() {
  try {
    
    const response = await axios.get(apiUrl, {
      params: {
        onchainID: trtlonchainID
      },
      headers: {
        'x-api-key': TAPTOOLS_API_KEY,
      },
    });

    const poolData = response.data[0];
    const tokenBLocked = poolData.tokenBLocked;

    const totalAdaLocked = tokenBLocked * 2;

    return totalAdaLocked;
  } catch (error) {
    console.error("Error fetching TRTL/ADA pool data:", error);
    throw new Error('Failed to fetch TRTL/ADA pool data');
  }
}
