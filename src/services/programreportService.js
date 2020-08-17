const db = require('../database/databases');
const SQL = require('sql-template-strings');
const { getMonthYear } = require('../helpers/parseHelpers');
const { program } = require('./programService');
const { organization } = require('./organizationService');
const { programreportdata } = require('./programreportdataService');
const { programreportoutcomes } = require('./programreportoutcomesService');
const { getBenchmarkData } = require('./benchmarkdataService');
const { programreportactivties } = require('./programreportactivitiesService');
const { programreportpostals } = require('./programreportpostalsService');
const {
  programreportbeneficiaries,
} = require('./programreportbeneficiaryService');
const { programreportregions } = require('./programreportregionsService');
const {
  programreportdataversions,
} = require('./programreportdataversionService');

const { getLocation } = require('./programlocationService');

const calculateScore = async (typeofdata, outcomefit, validity) => {
  if (!typeofdata || !outcomefit || !validity) {
    return null;
  } else {
    return typeofdata + outcomefit + validity;
  }
};

const programreport = async (programreportuuid) => {
  const q0 = SQL`SELECT
  programreportid,
  programid,
  startdate,
  enddate,
  fullcycle,
  impactverified,
  impactverifieddate,
  submitteddate
  FROM programreports AS pr
  WHERE programreportuuid = ${programreportuuid}
  ORDER BY programreportid DESC
  `;

  const result = await db.query(q0);
  if (result.length > 0) {
    return { ...result[0] };
  } else {
    return null;
  }
};

const getAllData = async (programreportuuid) => {
  const r = await programreport(programreportuuid);
  const a = await program(r.programid);
  const b = await organization(a.organizationid);
  const c = await programreportdataversions(r.programreportid);
  const s = await programreportdata(
    r.programreportid,
    c.programreportdataversionid
  );
  const t = await programreportoutcomes(
    r.programreportid,
    c.programreportdataversionid
  );
  const u = await getBenchmarkData(t.primaryoutcome.id);
  const genes = await programreportactivties(
    r.programreportid,
    c.programreportdataversionid
  );
  const regions = await programreportregions(
    r.programreportid,
    c.programreportdataversionid
  );
  const postals = await programreportpostals(
    r.programreportid,
    c.programreportdataversionid
  );
  const beneficiaries = await programreportbeneficiaries(
    r.programreportid,
    c.programreportdataversionid
  );

  const score = await calculateScore(
    s.typeofdatacollectedvalue,
    s.outcomefitweight,
    s.validityweight
  );

  const location = await getLocation(
    r.programid,
    r.programreportid,
    c.programreportdataversionid
  );

  d3ids = regions.filter((region) => {
    return region.countryid == 1;
  });
  d3ids = d3ids.map((region) => {
    return region.d3id;
  });

  return {
    ...a,
    ...b,
    ...r,
    ...s,
    ...t,
    ...u,
    score: score,
    secondaryoutcomes: t.outcomes
      .filter((outcome) => {
        return !outcome.isprimary;
      })
      .map((outcome) => outcome.name)
      .join(', '),
    submitteddate: getMonthYear(r.submitteddate),
    location: location,
    genes: genes,
    postals: postals,
    regions: regions,
    d3ids: d3ids,
    beneficiarycharacateristics: beneficiaries,
    cpo: parseInt(s.totalbudget / t.primaryoutcome.acheived),
    efficacy: Math.round(
      100 * (t.primaryoutcome.acheived / t.primaryoutcome.measured)
    ),
  };
};

module.exports = {
  programreport: programreport,
  getAllData: getAllData,
};
