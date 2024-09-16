import axios from 'axios';

const KOIOS_API_URL = 'https://api.koios.rest/api/v1/asset_info';

const assetList = [
    [
        "e4214b7cce62ac6fbba385d164df48e157eae5863521b4b67ca71d86",
        "ccd6ccf11c5eab6a9964bc9a080a506342a4bb037209e100f0be238da7495a9c"
      ],
];

// Bearer token
const BEARER_TOKEN = ''; // Input KOIOS API key here

export const getTotalLPTokens = async () => {
  try {
    const response = await axios.post(
      KOIOS_API_URL,
      { _asset_list: assetList },
      {
        headers: {
          'accept': 'application/json',
          'authorization': `Bearer ${BEARER_TOKEN}`,
          'content-type': 'application/json'
        },
      }
    );
    return response.data[0].total_supply;
  } catch (error) {
    console.error('Error fetching asset info:', error);
    throw new Error('Failed to fetch asset information');
  }
};
