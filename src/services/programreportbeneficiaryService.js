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
  // probably want to add the AND clause:  AND prb.programreportdataversionid = ${programreportdataversionid}
  // back sometime later
  const q0 = SQL`SELECT prb.inputvalue AS value, si.labeltext AS beneficiarychar, CASE WHEN si.questionid = 42 THEN ${gender} WHEN si.questionid = 43 THEN ${age} WHEN si.questionid = 44 THEN ${ethnicity} WHEN si.questionid = 45 THEN ${add_char} END AS category FROM programreportbeneficiaries AS prb INNER JOIN (SELECT * FROM survey_db.inputvalues WHERE questionid IN (42, 43, 44, 45)) AS si ON prb.inputdataid = si.inputvalueid AND prb.programreportdataversionid = ${programreportdataversionid} ORDER BY \`order\``;
  const r = await db.query(q0);
  const q1 = SQL`SELECT value, category AS beneficiarychar, CASE WHEN questionname = 'agerange' THEN ${age} WHEN questionname = 'raceethnicity' THEN ${ethnicity} END AS category FROM additionalmoodysquestions WHERE questionname IN ('agerange', 'raceethnicity') AND value IS NOT NULL AND programreportdataversionid = ${programreportdataversionid} ORDER BY questionname`;
  const s = await db.query(q1);

  let chars = [];
  if (r.length > 0) {
    for (let i = 0; i < r.length; i++) {
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

    if (
      !chars.filter((char) => {
        return char.category == ethnicity;
      }).length &&
      s.length > 0
    ) {
      for (let i = 0; i < s.length; i++) {
        let char = {};
        char.beneficiarychar = s[i].beneficiarychar;
        char.value = s[i].value;
        char.category = s[i].category;
        chars.push(char);
      }
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
