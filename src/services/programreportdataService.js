const db = require("../database/databases");
const SQL = require("sql-template-strings");

const programreportdata = async (
  programreportid,
  programreportdataversionid
) => {
  const q0 = SQL`SELECT usestechnology, new_dosagelabel.scorecard_labeltext AS dosagelabel, new_frequencylabel.scorecard_labeltext AS frequencylabel, new_durationlabel.scorecard_labeltext AS durationlabel, totalhours, intensitycomments, beneficiarydescription, 
  eligibilitycriteria, distancefromlocation, describeoutcomecalculation, pc.name AS programclassification, programreportdata.programname AS programname, programreportdata.programdescription AS description,
  CASE WHEN typeofdatacollectedid = 43 THEN 1 WHEN typeofdatacollectedid = 44 THEN 2 WHEN typeofdatacollectedid = 45 THEN 3 WHEN typeofdatacollectedid = 46 THEN 4 WHEN typeofdatacollectedid = 47 THEN 5 ELSE 0 END AS typeofdatacollectedvalue, 
  typeofdatacollectedlabel, IF(rate, rate * totalbudget, totalbudget) AS totalbudget, 'USD' AS budgetcurrencytype, mminsight, CONCAT(MONTHNAME(created) ," ", YEAR(created)) AS insightdate, inkinddonationsreceived, inkinddonationscurrencytype, inkinddonationsdescription, volunteersused, volunteerhours, volunteerpercentage, 
  additionalcomments, address AS addressoutcome, model AS evaluationmodel, location AS evidencecollectedlocation, _evidenceimprovement.improvement AS evidenceimprovement, _evidenceimprovement.weight AS evidenceimprovementweight,
  expertevidence, instrumenttype, _measurementtype.measure AS measurementtype, fit AS outcomefit, ofit.weight AS outcomefitweight, val.weight AS validityweight, collector AS programcollector, _proximityofmeasure.measure AS proximityofmeasure,
  source, _subjectofmeasure.measure AS subjectofmeasure, validity AS validity FROM programreportdata 
      LEFT JOIN v_latestexchangerates ON currancycode = budgetcurrencytype
      LEFT JOIN taxonomy_db.programclassifications pc ON primaryoutcomeclassificationid = programclassificationid
      LEFT JOIN _addressoutcome USING (addressoutcomeid) 
      LEFT JOIN _evaluationmodel USING (evaluationmodelid)
      LEFT JOIN _evidencecollectedlocation USING (evidencecollectedlocationid)
      LEFT JOIN _evidenceimprovement USING (evidenceimprovementid)
      LEFT JOIN _expertevidence USING (expertevidenceid)
      LEFT JOIN _instrumenttype USING (instrumenttypeid)
      LEFT JOIN _measurementtype USING (measurementtypeid)
      LEFT JOIN _outcomefit AS ofit USING (outcomefitid)
      LEFT JOIN _programcollector USING (programcollectorid)
      LEFT JOIN _proximityofmeasure USING (proximityofmeasureid)
      LEFT JOIN _source USING (sourceid)
      LEFT JOIN _subjectofmeasure USING (subjectofmeasureid)
      -- LEFT JOIN _typeofmeasure USING (typeofmeasureid) */
      LEFT JOIN _validity AS val USING (validityid)
      LEFT JOIN survey_db.inputvalues AS new_dosagelabel ON new_dosagelabel.inputvalueid = dosageid
      LEFT JOIN survey_db.inputvalues AS new_frequencylabel ON new_frequencylabel.inputvalueid = frequencyid
      LEFT JOIN survey_db.inputvalues AS new_durationlabel ON new_durationlabel.inputvalueid = durationid
  WHERE programreportid = ${programreportid} AND programreportdataversionid = ${programreportdataversionid} LIMIT 1
  `;

  const result = await db.query(q0);
  if (result.length > 0) {
    return { ...result[0] };
  } else {
    return null;
  }
};

module.exports = {
  programreportdata: programreportdata,
};
