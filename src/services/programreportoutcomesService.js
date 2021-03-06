const db = require("../database/databases");
const SQL = require("sql-template-strings");

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
  const q0 = SQL`SELECT programreportdataversionid, programreportid, pro.outcomeid AS outcomeid, outcomerank, MAX(isprimary) AS isprimary, measured, acheived, pro.beneficiarytypeid, oq.*, o.*, g.*, i.*, b.* FROM programreportoutcomes AS pro 
  LEFT JOIN (SELECT name AS outcomename, outcomeid, genomeid, impactareaid, description, definition, universaloutcomeid FROM taxonomy_db.outcomes) AS o ON pro.outcomeid = o.outcomeid
  LEFT JOIN taxonomy_db.outcomequalifier AS oq ON (pro.outcomeid = oq.outcomeid) 
  LEFT JOIN (SELECT name AS genomename, genomeid FROM taxonomy_db.genomes) AS g ON g.genomeid = o.genomeid
  LEFT JOIN  (SELECT name AS impactareaname, impactareaid FROM taxonomy_db.impactareas) AS i ON i.impactareaid = o.impactareaid
  LEFT JOIN (SELECT name AS beneficiaryname, beneficiarytypeid FROM taxonomy_db.beneficiarytypes) AS b USING (beneficiarytypeid)
  /* might need to filter out old revisions */
  WHERE programreportdataversionid = ${programreportdataversionid} AND programreportid = ${programreportid} GROUP BY pro.outcomeid ORDER BY pro.outcomerank DESC
  `;

  const result = await db.query(q0);
  let outcomes = [];
  let primaryoutcome = {};
  for (i = 0; i < result.length; i++) {
    if (result[i].isprimary) {
      let outcome = {};
      outcome.id = result[i].outcomeid;
      outcome.code = result[i].universaloutcomeid;
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
      primaryoutcome = outcome;
      continue;
    } else {
      if (outcomes.length < 5) {
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
        outcomes.push(outcome);
      } else {
        continue;
      }
    }
  }
  return {
    outcomes: outcomes,
    primaryoutcome: primaryoutcome,
    beneficiaryname: primaryoutcome.beneficiary,
  };
};

module.exports = {
  programreportoutcomes: programreportoutcomes,
};
