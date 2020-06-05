const db = require('../database/databases');
const SQL = require('sql-template-strings');

const programreportpostals = async (
  programreportid,
  programreportdataversionid
) => {
  const q0 = SQL`SELECT * FROM programreportpostals AS prr LEFT JOIN countries AS c USING (countryid) WHERE programreportid = ${programreportid} AND programreportdataversionid = ${programreportdataversionid}`;
  const r = await db.query(q0);

  let postals = [];
  for (i = 0; i < r.length; i++) {
    let postal = {};
    postal.countryid = r[i].countryid;
    postal.name = r[i].name;
    postal.postals = r[i].postals;
    postals.push(postal);
  }

  return postals;
};

module.exports = {
  programreportpostals,
};
