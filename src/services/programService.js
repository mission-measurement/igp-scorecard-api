const db = require('../database/databases');
const SQL = require('sql-template-strings');

const program = async (programid) => {
  const q0 = SQL`SELECT p.*, p.name AS programname, b.name AS beneficiaryname, pc.name AS programclassification FROM programs AS p LEFT JOIN taxonomy_db.beneficiarytypes AS b USING (beneficiarytypeid) LEFT JOIN taxonomy_db.programclassifications AS pc USING (programclassificationid) WHERE programid = ${programid}`;
  const r = await db.query(q0);

  if (r.length == 1) {
    return {
      ...r[0],
    };
  } else {
    console.log(`Program: ${programid} doesn't exist`);
    throw new Error(`Program: ${programid} doesn't exist`);
  }
};

module.exports = {
  program,
};
