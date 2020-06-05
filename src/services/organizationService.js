const db = require('../database/databases');
const SQL = require('sql-template-strings');

const organization = async (organizationid) => {
  const q0 = SQL`SELECT organizations.*, name AS organizationname FROM organizations WHERE organizationid = ${organizationid}`;
  const r = await db.query(q0);

  if (r.length == 1) {
    return {
      ...r[0],
    };
  } else {
    console.log(`Organization: ${organizationid} doesn't exist`);
    throw new Error(`Organization: ${organizationid} doesn't exist`);
  }
};

module.exports = {
  organization,
};
