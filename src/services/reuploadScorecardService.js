const SQL = require('sql-template-strings');
const fs = require('fs');
const path = require('path');

const hubDB = require('../database/databases');
const scorecardService = require('../services/scorecardService');
const { uploadScorecard } = require('../helpers/uploadScorecard');

const generateNewScorecard = async (programreportuuid) => {
  const filename = await scorecardService.getNewPDF(programreportuuid, false);
  return path.join(__dirname + '../../../public/tmp/' + filename + '.pdf');
};

const reuploadScorecard = async (programreportid) => {
  let q = SQL`SELECT * FROM programreports WHERE programreports.programreportid = ${programreportid}`;
  let r = await hubDB.query(q);

  if (r.length != 1) {
    throw new Error('How can this possibly be the case');
  } else {
    let programreportuuid = r[0].programreportuuid;
    let filename = await generateNewScorecard(programreportuuid);
    let { location } = await uploadScorecard(programreportid, filename);

    fs.unlinkSync(filename);
    return location;
  }
};

const resetScorecardCreation = async (programreportid) => {
  q = SQL`UPDATE portfolio INNER JOIN portfolioprograms USING(portfolioid) SET scorecardcreation = NULL WHERE programreportid = ${programreportid}`;
  await hubDB.query(q);
};

module.exports = {
  reuploadScorecard,
  resetScorecardCreation,
};
