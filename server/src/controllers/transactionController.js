const  Transaction = require('../models/Transaction.js');
const { fetchTransactionData } = require('../utils/api.js');

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

 const getTransactions = async (req, res) => {
  try {
    const { month, search = '', page = 1, perPage = 10 } = req.query;
    const skip = (page - 1) * perPage;

    const query = {
      $expr: { $eq: [{ $month: '$dateOfSale' }, parseInt(month)] }
    };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { price: isNaN(search) ? undefined : Number(search) }
      ].filter(Boolean);
    }

    const transactions = await Transaction.find(query)
      .skip(skip)
      .limit(parseInt(perPage));

    const total = await Transaction.countDocuments(query);

    res.json({
      transactions,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / perPage)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

 const getStatistics = async (req, res) => {
  try {
    const { month } = req.query;
    const monthQuery = { $expr: { $eq: [{ $month: '$dateOfSale' }, parseInt(month)] } };

    const [totalSale, soldItems, notSoldItems] = await Promise.all([
      Transaction.aggregate([
        { $match: monthQuery },
        { $group: { _id: null, total: { $sum: '$price' } } }
      ]),
      Transaction.countDocuments({ ...monthQuery, sold: true }),
      Transaction.countDocuments({ ...monthQuery, sold: false })
    ]);

    res.json({
      totalSaleAmount: totalSale[0]?.total || 0,
      totalSoldItems: soldItems,
      totalNotSoldItems: notSoldItems
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

 const getBarChartData = async (req, res) => {
  try {
    const { month } = req.query;
    const ranges = [
      { min: 0, max: 100 },
      { min: 101, max: 200 },
      { min: 201, max: 300 },
      { min: 301, max: 400 },
      { min: 401, max: 500 },
      { min: 501, max: 600 },
      { min: 601, max: 700 },
      { min: 701, max: 800 },
      { min: 801, max: 900 },
      { min: 901, max: Infinity }
    ];

    const monthQuery = { $expr: { $eq: [{ $month: '$dateOfSale' }, parseInt(month)] } };
    const result = await Promise.all(
      ranges.map(async ({ min, max }) => {
        const count = await Transaction.countDocuments({
          ...monthQuery,
          price: { $gte: min, $lt: max === Infinity ? Number.MAX_VALUE : max }
        });
        return {
          range: `${min}-${max === Infinity ? 'above' : max}`,
          count
        };
      })
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

 const getPieChartData = async (req, res) => {
  try {
    const { month } = req.query;
    const result = await Transaction.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $month: '$dateOfSale' }, parseInt(month)] }
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(result.map(item => ({
      category: item._id,
      count: item.count
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

 const getCombinedData = async (req, res) => {
  try {
    const { month } = req.query;
    const [transactions, statistics, barChart, pieChart] = await Promise.all([
      getTransactions(req, { json: data => data }),
      getStatistics(req, { json: data => data }),
      getBarChartData(req, { json: data => data }),
      getPieChartData(req, { json: data => data })
    ]);

    res.json({
      transactions,
      statistics,
      barChart,
      pieChart
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  initializeDatabase,
  getTransactions,
  getStatistics,
  getBarChartData,
  getPieChartData,
  getCombinedData,
};