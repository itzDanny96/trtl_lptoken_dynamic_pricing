import axios from 'axios';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/coins/cardano';

export const getAdaPrice = async () => {
  try {
    const response = await axios.get(COINGECKO_API_URL);
    
    const adaData = response.data;

    const priceInUSD = adaData?.market_data?.current_price?.usd;

    if (!priceInUSD) {
      throw new Error('Price information is not available');
    }

    return priceInUSD;
  } catch (error) {
    console.error('Error fetching TRTL price:', error);
    throw new Error('Failed to fetch TRTL price');
  }
};
