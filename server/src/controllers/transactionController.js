const  Transaction = require('../models/Transaction.js');
const { fetchTransactionData } = require('../utils/api.js');
const {
  getTransactions,
  getStatistics,
  getBarChartData,
  getPieChartData
} = require('../services/transactionService.js');

 const initializeDatabase = async (req, res) => {
  try {
    const data = await fetchTransactionData();
    await Transaction.deleteMany({});
    await Transaction.insertMany(data);
    res.json({ message: 'Database initialized successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const handleGetTransactions = async (req, res) => {
  try {
    const { month, search = '', page = 1, perPage = 10 } = req.query;
    const data = await getTransactions(month, search, page, perPage);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const handleGetStatistics = async (req, res) => {
  try {
    const { month } = req.query;
    const data = await getStatistics(month);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const handleGetBarChartData = async (req, res) => {
  try {
    const { month } = req.query;
    const data = await getBarChartData(month);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const handleGetPieChartData = async (req, res) => {
  try {
    const { month } = req.query;
    const data = await getPieChartData(month);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




const handleGetCombinedData = async (req, res) => {
  try {
    const { month, search, page, perPage } = req.query;

    const [transactions, statistics, barChart, pieChart] = await Promise.all([
      getTransactions(month, search, page, perPage),
      getStatistics(month),
      getBarChartData(month),
      getPieChartData(month)
    ]);

    res.json({
      transactions,
      statistics,
      barChart,
      pieChart
    });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  initializeDatabase,
  handleGetTransactions,
  handleGetStatistics,
  handleGetBarChartData,
  handleGetPieChartData,
  handleGetCombinedData
};