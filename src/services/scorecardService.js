const db = require("../database/databases");
const path = require("path");
const fs = require("fs");
const { getAllData } = require("./programreportService");
const puppeteer = require("puppeteer");
const Handlebars = require("handlebars");
const SQL = require("sql-template-strings");
const axios = require("axios");
const sanitize = require("sanitize-filename");

let browser; // use a singleton instance of puppeteer

// register custom helper functions to Handlebars here:
Handlebars.registerHelper("addOne", function (value) {
  return value + 1;
});

Handlebars.registerHelper("ifBetween", function (arg1, value, arg2, options) {
  if (arg1 <= value && value <= arg2) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

Handlebars.registerHelper("formatDate", function (datetime, format) {
  if (format == "short") {
    return datetime.toLocaleDateString();
  } else {
    months = [
      "January",
      "Feburary",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    try {
      monthIndex = datetime.getMonth();
      year = datetime.getFullYear();
      return months[monthIndex] + " " + year;
    } catch (error) {
      return "unknown";
    }
  }
});

Handlebars.registerHelper("decimal", function (number) {
  if (number < 1) {
    return parseFloat(number).toFixed(2);
  } else {
    return parseInt(number).toLocaleString("en-US");
  }
});
// ...

// load the current template
const template = fs.readFileSync(
  path.join(__dirname, "../../public/templates/v2/template.handlebars"),
  "utf-8"
);

/**
 * Digests data into HTML template
 * @param {*} data the data containing the report
 */
const parseToHTML = (data) => {
  const temp = Handlebars.compile(template);
  const result = temp(data);
  return result;
};

/**
 * Renders the (parsed) HTML in puppeteer and creates a screenshot (a.k.a. PDF)
 * @param {*} parsedHTML
 */
const parseToPDF = async (r, parsedHTML, usesingleton = false) => {
  let filename = r.organizationname + " - " + r.reportigpuid;
  filename = sanitize(filename);
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });
  }

  try {
    const page = await browser.newPage();
    await page.setContent(parsedHTML, { waitUntil: "networkidle2" });
    await page.waitFor(800);

    await page.emulateMedia("screen");
    await page.pdf({
      path: path.join(__dirname + "../../../public/tmp/" + filename + ".pdf"),
      printBackground: true,
      preferCSSPageSize: false,
    });
    await page.close();

    if (!usesingleton) {
      await browser.close();
      browser = undefined;
    }

    return filename;
  } catch (error) {
    console.log(error);
    await browser.close();
  }
};

const getScorecardPDF = async (reportuuid) => {
  try {
    const q = SQL`SELECT s.*, p.*, o.name AS organizationname FROM scorecards s INNER JOIN programreports p USING(programreportid) INNER JOIN programs ON p.programid = programs.programid INNER JOIN organizations o USING(organizationid) WHERE programreportuuid = ${reportuuid} ORDER BY scorecardid DESC LIMIT 1`;
    const r = await db.query(q);

    if (r.length) {
      console.log("Fetched from S3!");
      let filename = r[0].organizationname + "-" + r[0].reportigpuid;
      filename = sanitize(filename);
      const location = path.join(
        __dirname + "/../../public/tmp/" + filename + ".pdf"
      );
      const url = r[0].url;
      const response = await axios({
        method: "get",
        url: url,
        responseType: "stream",
      });

      let writer = fs.createWriteStream(location);
      response.data.pipe(writer);
      return new Promise((resolve, reject) => {
        writer.on("finish", () => {
          resolve(filename);
        });
      });
    } else {
      return undefined;
    }
  } catch (e) {
    console.error(e);
  }
};

const getPortfolioScorecards = async (portfolioid) => {
  const q = SQL`SELECT programreportuuid FROM programreports INNER JOIN portfolioprograms USING(programreportid) WHERE portfolioid = ${portfolioid} AND impactverified = 1`;
  const r = await db.query(q);

  let filenames = [];
  if (r.length) {
    for (let i = 0; i < r.length; i++) {
      let programreportuuid = r[i].programreportuuid;
      let filename = await getScorecardPDF(programreportuuid);
      if (!filename) {
        filename = await getPDF(programreportuuid, false);
        if (filename) {
          filenames.push(filename);
        }
      } else {
        filenames.push(filename);
      }
    }
    return filenames;
  } else {
    return [];
  }
};

/**
 * Generates the PDF for a given reportuuid
 * @param {*} reportuuid
 */
const getPDF = async (reportuuid, usesingleton = false) => {
  // Get all necessary data
  const filename = await getScorecardPDF(reportuuid);
  if (filename) {
    return filename;
  } else {
    const r = await getAllData(reportuuid);
    const s = parseToHTML({
      ...r,
      host: process.env.API_HOST || "https://api.impactgenome.com",
    });
    const t = await parseToPDF(r, s, usesingleton);
    return t;
  }
};

const getNewPDF = async (reportuuid, usesingleton = false) => {
  const r = await getAllData(reportuuid);
  const s = parseToHTML({
    ...r,
    host: process.env.API_HOST || "https://api.impactgenome.com",
  });
  const t = await parseToPDF(r, s, usesingleton);
  return t;
};

/**
 * Generates just the HTML for a given reportuuid
 * @param {*} reportuuid
 */
const getHTML = async (reportuuid) => {
  // Get all necessary data
  const r = await getAllData(reportuuid);
  const s = parseToHTML({ ...r, host: process.env.API_HOST });
  return s;
};

module.exports = {
  getPDF: getPDF,
  getHTML: getHTML,
  getNewPDF: getNewPDF,
  getPortfolioScorecards: getPortfolioScorecards,
};
