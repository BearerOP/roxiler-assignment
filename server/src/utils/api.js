const axios = require('axios');
const seedingDataApi = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';

const fetchTransactionData = async () => {
  try {
    const response = await axios.get(seedingDataApi);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch transaction data');
  }
};

module.exports = {
  fetchTransactionData
};