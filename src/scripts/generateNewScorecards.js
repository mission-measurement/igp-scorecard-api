//require('dotenv').config();
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const SQL = require('sql-template-strings');

const hubDB = require('../database/databases');
const scorecardController = require('../controllers/scorecardController');

const main = async () => {
  let q = SQL`SELECT * FROM programreports WHERE programreports.ispublished AND programreports.programreportid NOT IN (SELECT programreportid FROM scorecards)`;
  let result = await hubDB.query(q);

  for (i = 0; i < result.length; i++) {
    try {
      let uuid = result[i].programreportuuid;
      let programreportid = result[i].programreportid;
      let filename = await scorecardController.generateScorecard(uuid);
      let { location, programreportuuid } = await uploadScorecard(
        programreportid,
        filename
      );
      fs.unlinkSync(filename);
      await insertNewScorecard(programreportid, location);
      console.log('Added scorecard for:');
      console.log(uuid);
    } catch (error) {
      console.log(error);
    }
  }
  return;
};

const insertNewScorecard = async (programreportid, url) => {
  let q = SQL`INSERT INTO igp_apps_db.scorecards (programreportid, programid, url, type, creationdate, final) SELECT ${programreportid}, programid, ${url}, NULL, NOW(), 1 FROM igp_apps_db.programreports WHERE programreportid = ${programreportid}`;
  await hubDB.query(q);
};

const uploadScorecard = async (programreportid, filename) => {
  let data = new FormData();
  data.append('scorecard', fs.createReadStream(filename));
  let config = {
    method: 'post',
    url: `${process.env.API_HOST}/aws/programreports/scorecard?programreportid=${programreportid}`,
    headers: {
      Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
      ...data.getHeaders(),
    },
    data: data,
  };
  let r = await axios(config);
  return r.data;
};

main();
