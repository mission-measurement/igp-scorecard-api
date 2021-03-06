const db = require("../database/databases");
const SQL = require("sql-template-strings");

const getLocation = async (
  programid,
  programreportid,
  programreportdataversionid
) => {
  let q = SQL`SELECT * FROM programlocations LEFT JOIN countries USING(countryid) WHERE programid = ${programid} GROUP BY countryid`;
  let r = await db.query(q);

  let countries = [];
  for (let i = 0; i < r.length; i++) {
    country = {};
    country.name = r[i].name;
    country.code = r[i].code;
    country.countryid = r[i].countryid;
    country.continent = r[i].continent;
    country.regions = await getRegions(
      programreportid,
      programreportdataversionid,
      r[i].countryid
    );
    countries.push(country);
  }

  if (countries.length > 5 && countries.length < 10) {
    countries = countries
      .map((country) => {
        if (country.regions.length) {
          if (country.regions.length <= 5) {
            return (
              country.code +
              " (" +
              country.regions.map((region) => region.name).join(", ") +
              ")"
            );
          } else if (country.regions.length >= 48 && country.countryid == 1) {
            return country.code + " (all of the states)";
          } else {
            return (
              country.code +
              " (" +
              country.regions.map((region) => region.code).join(", ") +
              ")"
            );
          }
        } else {
          return country.code;
        }
      })
      .join(", ");
  } else if (countries.length > 10) {
    let continents = countries.map((c) => {
      return c.continent;
    });
    continents = continents.reduce((r, c) => ((r[c] = (r[c] || 0) + 1), r), {});
    let result = [];
    for (let [k, v] of Object.entries(continents)) {
      if (k && k != "null") {
        result.push(`${k} (${v}${result.length == 0 ? " countries)" : ")"}`);
      }
    }
    result = result.join(", ");
    return result;
  } else {
    countries = countries
      .map((country) => {
        if (country.regions.length) {
          if (country.regions.length <= 5) {
            return (
              country.name +
              " (" +
              country.regions.map((region) => region.name).join(", ") +
              ")"
            );
          } else if (country.regions.length == 50) {
            return country.name + " (all of the states)";
          } else {
            return (
              country.name +
              " (" +
              country.regions.map((region) => region.code).join(", ") +
              ")"
            );
          }
        } else {
          return country.name;
        }
      })
      .join(", ");
  }
  return countries;
};

const getRegions = async (
  programreportid,
  programreportdataversionid,
  countryid
) => {
  let q = SQL`SELECT * FROM programreportregions LEFT JOIN regions USING(regionid) WHERE countryid = ${countryid} AND programreportid = ${programreportid} AND programreportdataversionid = ${programreportdataversionid} GROUP BY regionid`;

  let r = await db.query(q);
  return r;
};

module.exports = {
  getLocation,
};
