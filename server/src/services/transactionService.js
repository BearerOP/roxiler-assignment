const Transaction = require('../models/Transaction.js');

const getTransactions = async (month, search = '', page = 1, perPage = 10) => {
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

  const transactions = await Transaction.find(query).skip(skip).limit(parseInt(perPage));
  const total = await Transaction.countDocuments(query);

  return {
    transactions,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / perPage)
  };
};

const getStatistics = async (month) => {
  const monthQuery = { $expr: { $eq: [{ $month: '$dateOfSale' }, parseInt(month)] } };

  const [totalSale, soldItems, notSoldItems] = await Promise.all([
    Transaction.aggregate([
      { $match: monthQuery },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]),
    Transaction.countDocuments({ ...monthQuery, sold: true }),
    Transaction.countDocuments({ ...monthQuery, sold: false })
  ]);

  return {
    totalSaleAmount: totalSale[0]?.total || 0,
    totalSoldItems: soldItems,
    totalNotSoldItems: notSoldItems
  };
};

const getBarChartData = async (month) => {
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

  return Promise.all(
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
};

const getPieChartData = async (month) => {
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

  return result.map(item => ({
    category: item._id,
    count: item.count
  }));
};

module.exports = {
  getTransactions,
  getStatistics,
  getBarChartData,
  getPieChartData
};
