const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../helpers/authHelpers');

// import all routes
const scorecardRoutes = require('./v1/scorecardRoutes');

// use all routes as needed
router.use('/scorecard', [authenticateToken], scorecardRoutes);

module.exports = router;
