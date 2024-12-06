const axios = require('axios');
const THIRD_PARTY_API = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';

const fetchTransactionData = async () => {
  try {
    const response = await axios.get(THIRD_PARTY_API);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch transaction data');
  }
};

module.exports = {
  fetchTransactionData
};