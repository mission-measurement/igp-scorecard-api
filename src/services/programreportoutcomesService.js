const db = require('../database/databases');
const SQL = require('sql-template-strings');

const outcomecriterias = async (outcomeid) => {
  const q0 = SQL`SELECT * FROM taxonomy_db.outcomecriteria WHERE outcomeid = ${outcomeid}`;
  r = await db.query(q0);
  let criterias = [];
  for (let i = 0; i < r.length; i++) {
    criterias.push(r[i].criteria);
  }
  return criterias;
};

const programreportoutcomes = async (
  programreportid,
  programreportdataversionid
) => {
  const q0 = SQL`SELECT * FROM programreportoutcomes AS pro 
  LEFT JOIN (SELECT name AS outcomename, outcomeid, genomeid, impactareaid, description, definition FROM taxonomy_db.outcomes) AS o ON pro.outcomeid = o.outcomeid
  LEFT JOIN taxonomy_db.outcomequalifier AS oq ON (pro.outcomeid = oq.outcomeid) 
  LEFT JOIN (SELECT name AS genomename, genomeid FROM taxonomy_db.genomes) AS g ON g.genomeid = o.genomeid
  LEFT JOIN  (SELECT name AS impactareaname, impactareaid FROM taxonomy_db.impactareas) AS i ON i.impactareaid = o.impactareaid
  LEFT JOIN (SELECT name AS beneficiaryname, beneficiarytypeid FROM taxonomy_db.beneficiarytypes) AS b USING (beneficiarytypeid)
  /* might need to filter out old revisions */
  WHERE programreportdataversionid = ${programreportdataversionid} AND programreportid = ${programreportid} 
  `;

  const result = await db.query(q0);
  let outcomes = [];
  let primaryoutcome = {};
  for (i = 0; i < result.length; i++) {
    let outcome = {};
    outcome.id = result[i].outcomeid;
    outcome.name = result[i].outcomename;
    outcome.genome = result[i].genomename;
    outcome.impactarea = result[i].impactareaname;
    outcome.beneficiary = result[i].beneficiaryname;
    outcome.description = result[i].description;
    outcome.definition = result[i].definition;
    outcome.qualifier = result[i].qualifier;
    outcome.criterias = await outcomecriterias(outcome.id);
    outcome.outcomerank = result[i].outcomerank;
    outcome.isprimary = result[i].isprimary;
    outcome.measured = result[i].measured;
    outcome.acheived = result[i].acheived;
    if (outcome.isprimary) {
      primaryoutcome = outcome;
    }
    outcomes.push(outcome);
  }
  return {
    outcomes: outcomes,
    primaryoutcome: primaryoutcome,
  };
};

module.exports = {
  programreportoutcomes: programreportoutcomes,
};
