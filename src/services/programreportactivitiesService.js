const db = require('../database/databases');
const SQL = require('sql-template-strings');

const programreportactivties = async (
  programreportid,
  programreportdataversionid
) => {
  const q0 = SQL`SELECT * FROM programreportactivties AS pra LEFT JOIN taxonomy_db.genes AS g USING (geneid) WHERE programreportid = ${programreportid} AND istop = 1 AND programreportdataversionid = ${programreportdataversionid} ORDER BY ranknum DESC LIMIT 5`;
  const r = await db.query(q0);

  let genes = [];
  for (i = 0; i < r.length; i++) {
    let gene = {};
    gene.id = r[i].geneid;
    gene.rank = r[i].ranknum;
    gene.name = r[i].name;
    gene.chromosomeid = r[i].chromosomeid;
    gene.description = r[i].description;
    gene.genomeid = r[i].genomeid;
    gene.code = r[i].code;
    genes.push(gene);
  }

  return genes;
};

module.exports = {
  programreportactivties,
};
