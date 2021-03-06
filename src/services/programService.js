const db = require("../database/databases");
const SQL = require("sql-template-strings");

const program = async (programid) => {
  const q0 = SQL`SELECT p.* FROM programs AS p WHERE programid = ${programid}`;
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
