const db = require('../database/databases');
const SQL = require('sql-template-strings');

const programreportregions = async (
  programreportid,
  programreportdataversionid
) => {
  const q0 = SQL`SELECT * FROM programreportregions AS prr LEFT JOIN regions AS r USING (regionid) WHERE programreportid = ${programreportid} AND programreportdataversionid = ${programreportdataversionid}`;
  const r = await db.query(q0);

  let regions = [];
  for (i = 0; i < r.length; i++) {
    let region = {};
    region.id = r[i].regionid;
    region.name = r[i].name;
    region.countryid = r[i].countryid;
    region.d3id = r[i].d3id;
    regions.push(region);
  }

  return regions;
};

module.exports = {
  programreportregions,
};
