const express = require('express');
const scorecardRoutes = express.Router();
const scorecardController = require('../../controllers/scorecardController');

scorecardRoutes.get('/', (req, res, next) => {
  scorecardController.sendPDF(req, res);
});

scorecardRoutes.get('/portfolio', (req, res, next) => {
  scorecardController.sendPDFBatch(req, res);
});


scorecardRoutes.post('/reupload', (req, res, next) => {
  scorecardController.reuploadScorecard(req, res)
})

module.exports = scorecardRoutes;
