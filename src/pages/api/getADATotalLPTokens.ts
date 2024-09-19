import axios from 'axios';

const KOIOS_API_URL1 = 'https://api.koios.rest/api/v1/asset_info'; 
const KOIOS_API_URL2 = 'https://api.koios.rest/api/v1/asset_addresses';

// Bearer token
const BEARER_TOKEN = ''; // Input KOIOS API key here

// Minswap V1 Pool
const assetListv1 = [
  ["e4214b7cce62ac6fbba385d164df48e157eae5863521b4b67ca71d86","ccd6ccf11c5eab6a9964bc9a080a506342a4bb037209e100f0be238da7495a9c"]
];
// Minswap V2 Pool
const assetListv2 = [
  ["f5808c2c990d86da54bfc97d89cee6efa20cd8461616359478d96b4c", "98cd1a0de51bf17c8ae857f72f215c75a447e4d04fa35cb58364e85e476012c3"]
];

// Payment address to filter for - the amount of LP token shown for TRTL/ADA V2 pool is not the total supply for the LP token. the below address matches the amount shown by min. From this address we get total number of V2 pool LP tokens
const TARGET_ADDRESS = 'addr1wxc45xspppp73takl93mq029905ptdfnmtgv6g7cr8pdyqgvks3s8';

export const getADAV1PoolSupply = async (): Promise<number> => {
  try {
    const response = await axios.post(
      KOIOS_API_URL1,
      { _asset_list: assetListv1 },
      {
        headers: {
          'accept': 'application/json',
          'authorization': `Bearer ${BEARER_TOKEN}`,
          'content-type': 'application/json',
        },
      }
    );

    const totalSupplyV1 = parseInt(response.data[0]?.total_supply,10);
    return totalSupplyV1;
  } catch (error) {
    console.error('Error fetching ADA V1 pool asset info:', error);
    throw new Error('Failed to fetch ADA V1 pool asset information');
  }
};

export const getADAV2PoolSupply = async (): Promise<number> => {
  try {
    const [policyId, assetName] = assetListv2[0]; // Extract policyID and asset name from assetListv2

    const response = await axios.post(
      KOIOS_API_URL2,
      {
        _asset_policy: policyId, // First parameter: Policy ID
        _asset_name: assetName,  // Second parameter: Encoded asset name
      },
      {
        headers: {
          'accept': 'application/json',
          'authorization': `Bearer ${BEARER_TOKEN}`,
          'content-type': 'application/json',
        },
      }
    );``

      const assetData = response.data.find(
      (entry: { payment_address: string }) => entry.payment_address === TARGET_ADDRESS
    );

    if (assetData) {
      const totalSupplyV2 = parseInt(assetData.quantity, 10); 
      return totalSupplyV2;
    } else {
      throw new Error('Target payment address not found in the response');
    }
  } catch (error) {
    console.error('Error fetching ADA V2 pool asset info:', error);
    throw new Error('Failed to fetch ADA V2 pool asset information');
  }
};
