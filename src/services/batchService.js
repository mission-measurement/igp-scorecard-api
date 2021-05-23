const db = require("../database/databases");
const SQL = require("sql-template-strings");
const sanitize = require("sanitize-filename");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");
const child_process = require("child_process");
const scorecardService = require("./scorecardService");

const generateBatchScorecards = async () => {
  const q0 = SQL`SELECT * FROM portfolio WHERE scorecardcreation IS NULL`;
  const r = await db.query(q0);

  for (let i = 0; i < r.length; i++) {
    let portfolioid = r[i].portfolioid;
    let raw_foldername = r[i].name + " (" + r[i].year + ")";
    let filenames = await scorecardService.getPortfolioScorecards(portfolioid);
    filenames = [...new Set(filenames)]; // make unique

    if (filenames.length) {
      // create temporary folder
      const foldername = sanitize(raw_foldername);
      fs.mkdirSync(path.join(__dirname + "../../../public/tmp/" + foldername));
      // iterate through the files and put them into a folder
      for (let j = 0; j < filenames.length; j++) {
        let filename = filenames[j];
        fs.renameSync(
          path.join(__dirname + "../../../public/tmp/" + filename + ".pdf"),
          path.join(
            __dirname +
              "../../../public/tmp/" +
              foldername +
              "/" +
              filename +
              ".pdf"
          )
        );
      }

      // zip up the folder
      exec_path = path.join(__dirname + "../../../public/tmp/" + foldername);
      child_process.execSync(`zip -j "${exec_path}" "${exec_path}/"*`);

      let data = new FormData();
      data.append(
        "file",
        fs.createReadStream(
          `${path.join(__dirname + "../../../public/tmp/" + foldername)}.zip`
        )
      );
      let config = {
        method: "post",
        url: `${process.env.API_HOST}/aws/portfolios/portfolio?portfolioid=${portfolioid}`,
        headers: {
          Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
          ...data.getHeaders(),
        },
        data: data,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      };
      console.log(config.url);
      let r = await axios(config);

      console.log(r);

      // remove the zip folder
      fs.unlinkSync(
        path.join(__dirname + "../../../public/tmp/" + foldername + ".zip")
      );
      fs.rmdirSync(path.join(__dirname + "../../../public/tmp/" + foldername), {
        recursive: true,
      });
    }
  }
};

module.exports = {
  generateBatchScorecards,
};
