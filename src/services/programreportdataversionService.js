const db = require('../database/databases');
const SQL = require('sql-template-strings');

const programreportdataversions = async (programreportid) => {
  const q0 = SQL`SELECT programreportdataversionid, ispublished, isinitial, comments FROM programreportdataversions WHERE programreportid = ${programreportid} ORDER BY programreportdataversionid DESC LIMIT 1`;
  const r = await db.query(q0);

  if (r.length == 1) {
    return {
      ...r[0],
    };
  } else {
    return null;
  }
};

module.exports = {
  programreportdataversions,
};
