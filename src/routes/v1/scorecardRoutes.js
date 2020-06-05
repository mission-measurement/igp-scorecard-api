const express = require('express');
const scorecardRoutes = express.Router();
const scorecardController = require('../../controllers/scorecardController');

scorecardRoutes.get('/', (req, res, next) => {
  scorecardController.sendPDF(req, res);
});

module.exports = scorecardRoutes;
