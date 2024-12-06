const express = require("express");
const router = express.Router();

const {
  initializeDatabase,
  handleGetTransactions,
  handleGetStatistics,
  handleGetBarChartData,
  handleGetPieChartData,
  handleGetCombinedData,
} = require("../controllers/transactionController.js");

router.get("/initialize", initializeDatabase);
router.get('/transactions', handleGetTransactions);
router.get('/statistics', handleGetStatistics);
router.get('/bar-chart', handleGetBarChartData);
router.get('/pie-chart', handleGetPieChartData);
router.get("/combined-data", handleGetCombinedData);

module.exports = router;
