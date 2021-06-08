const db = require("../database/databases");
const SQL = require("sql-template-strings");

const programreportactivties = async (
  programreportid,
  programreportdataversionid
) => {
  const q0 = SQL`SELECT pra.*, g.*, genomes.code AS genomeid, impactareas.code AS impactareaid FROM programreportactivties AS pra LEFT JOIN taxonomy_db.genes AS g USING (geneid) LEFT JOIN taxonomy_db.genomes USING(genomeid) LEFT JOIN taxonomy_db.impactareas USING(impactareaid) WHERE programreportid = ${programreportid} AND istop = 1 AND programreportdataversionid = ${programreportdataversionid} ORDER BY ranknum DESC LIMIT 5`;
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
    gene.code = "A" + r[i].impactareaid + "." + r[i].genomeid + "." + r[i].code;
    genes.push(gene);
  }

  return genes;
};

module.exports = {
  programreportactivties,
};
