//require('dotenv').config();
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const SQL = require('sql-template-strings');

const hubDB = require('../database/databases');
const scorecardController = require('../controllers/scorecardController');
const { uploadScorecard } = require('../helpers/uploadScorecard');
const { generateBatchScorecards } = require('../services/batchService');

const main = async () => {
  let q = SQL`SELECT * FROM programreports WHERE programreports.impactverified = 1 AND programreports.programreportid NOT IN (SELECT DISTINCT(programreportid) FROM scorecards)`;
  let result = await hubDB.query(q);

  for (let i = 0; i < result.length; i++) {
    try {
      let uuid = result[i].programreportuuid;
      let programreportid = result[i].programreportid;
      let filename = await scorecardController.generateScorecard(uuid);
      let { location, programreportuuid } = await uploadScorecard(
        programreportid,
        filename
      );
      fs.unlinkSync(filename);
      console.log('Added scorecard for:' + uuid);
    } catch (error) {
      console.log(error);
    }
  }

  await generateBatchScorecards();

  process.exit();
};

main();
