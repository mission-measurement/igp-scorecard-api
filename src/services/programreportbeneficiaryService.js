const db = require('../database/databases');
const SQL = require('sql-template-strings');

const programreportbeneficiaries = async (
  programreportid,
  programreportdataversionid
) => {
  const gender = 'Gender';
  const age = 'Age';
  const ethnicity = 'Ethnicity';
  const add_char = 'Additional Characteristics';

  const q0 = SQL`SELECT prb.inputvalue AS value, si.labeltext AS beneficiarychar, CASE WHEN si.questionid = 42 THEN ${gender} WHEN si.questionid = 43 THEN ${age} WHEN si.questionid = 44 THEN ${ethnicity} WHEN si.questionid = 45 THEN ${add_char} END AS category FROM programreportbeneficiaries AS prb LEFT JOIN survey_db.inputvalues AS si ON prb.inputdataid = si.inputvalueid WHERE si.questionid IN (42, 43, 44, 45) AND prb.programreportid = ${programreportid} AND prb.programreportdataversionid = ${programreportdataversionid} ORDER BY \`order\``;
  const r = await db.query(q0);
  let chars = [];
  for (i = 0; i < r.length; i++) {
    let char = {};
    char.beneficiarychar = r[i].beneficiarychar;
    char.value = r[i].value;
    char.category = r[i].category;

    if (
      parseInt(char.value) >= 10 ||
      char.beneficiarychar == gender ||
      char.beneficiarychar == ethnicity
    ) {
      chars.push(char);
    }
  }

  const genders = chars.filter((char) => {
    return char.category == gender;
  });
  const ages = chars.filter((char) => {
    return char.category == age;
  });
  const ethnicities = chars.filter((char) => {
    return char.category == ethnicity;
  });
  const add_chars = chars.filter((char) => {
    return char.category == add_char;
  });

  return {
    genders: genders,
    ages: ages,
    ethnicities: ethnicities,
    additionalcharacteristics: add_chars,
  };
};

module.exports = {
  programreportbeneficiaries,
};
