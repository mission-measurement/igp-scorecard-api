const db = require('../database/databases');
const SQL = require('sql-template-strings');

const getLocation = async (
  programid,
  programreportid,
  programreportdataversionid
) => {
  let q = SQL`SELECT * FROM programlocations LEFT JOIN countries USING(countryid) WHERE programid = ${programid}`;
  let r = await db.query(q);

  let countries = [];
  for (let i = 0; i < r.length; i++) {
    country = {};
    country.name = r[i].name;
    country.code = r[i].code;
    country.countryid = r[i].countryid;
    country.regions = await getRegions(
      programreportid,
      programreportdataversionid,
      r[i].countryid
    );
    countries.push(country);
  }

  if (countries.length > 5) {
    countries = countries
      .map((country) => {
        if (country.regions.length) {
          return (
            country.code +
            ' (' +
            country.regions.map((region) => region.code).join(', ') +
            ')'
          );
        } else {
          return country.code;
        }
      })
      .join(', ');
  } else {
    countries = countries
      .map((country) => {
        if (country.regions.length) {
          return (
            country.name +
            ' (' +
            country.regions.map((region) => region.name).join(', ') +
            ')'
          );
        } else {
          return country.name;
        }
      })
      .join(', ');
  }
  return countries;
};

const getRegions = async (
  programreportid,
  programreportdataversionid,
  countryid
) => {
  let q = SQL`SELECT * FROM programreportregions LEFT JOIN regions USING(regionid) WHERE countryid = ${countryid} AND programreportid = ${programreportid} AND programreportdataversionid = ${programreportdataversionid}`;

  let r = await db.query(q);
  return r;
};

module.exports = {
  getLocation,
};
