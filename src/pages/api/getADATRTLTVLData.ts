/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';

const apiUrl = "https://openapi.taptools.io/api/v1/token/pools";

// Pool On-chain IDs
const trtlonchainIDv1pool = "0be55d262b29f564998ff81efe21bdc0022621c12f15af08d0f2ddb1.ccd6ccf11c5eab6a9964bc9a080a506342a4bb037209e100f0be238da7495a9c";
const trtlonchainIDv2pool = "f5808c2c990d86da54bfc97d89cee6efa20cd8461616359478d96b4c.98cd1a0de51bf17c8ae857f72f215c75a447e4d04fa35cb58364e85e476012c3";

const TAPTOOLS_API_KEY = ""; // Input your Taptools API key here.

export async function fetchTrtlV1PoolData(): Promise<number> {
  try {
    // Mock response during testing
    // Easily undo this change by commenting out the next two lines and uncommenting the actual response handling.
    const v1ADAtvl = 100000;
    return v1ADAtvl;

    // Actual API call (comment this section out during testing)
    // const response = await axios.get(apiUrl, {
    //   params: { onchainID: trtlonchainIDv1pool },
    //   headers: {
    //     'x-api-key': TAPTOOLS_API_KEY,
    //   },
    // });
    //
    // const poolData = response.data[0];
    // const v1ADAtvl = poolData.tokenBLocked * 2;
    // return v1ADAtvl;
  } catch (error) {
    console.error("Error fetching TRTL V1 pool data:", error);
    throw new Error('Failed to fetch TRTL V1 pool data');
  }
}

export async function fetchTrtlV2PoolData(): Promise<number> {
  try {
    // Mock response during testing
    // Easily undo this change by commenting out the next two lines and uncommenting the actual response handling.
    const v2ADAtvl = 100000;
    return v2ADAtvl;
    // Actual API call (comment this section out during testing)
    // const response = await axios.get(apiUrl, {
    //   params: { onchainID: trtlonchainIDv2pool },
    //   headers: {
    //     'x-api-key': TAPTOOLS_API_KEY,
    //   },
    // });
    //
    // const poolData = response.data[0];
    // const v2ADAtvl = poolData.tokenBLocked * 2;
    // return v2ADAtvl;
  } catch (error) {
    console.error("Error fetching TRTL V2 pool data:", error);
    throw new Error('Failed to fetch TRTL V2 pool data');
  }
}
