const db = require('../database/databases');
const path = require('path');
const fs = require('fs');
const { getAllData } = require('./programreportService');
const puppeteer = require('puppeteer');
const Handlebars = require('handlebars');

// register custom helper functions to Handlebars here:
Handlebars.registerHelper('addOne', function (value) {
  return value + 1;
});

Handlebars.registerHelper('ifBetween', function (arg1, value, arg2, options) {
  if (arg1 <= value && value <= arg2) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});
// ...

// load the current template
const template = fs.readFileSync(
  path.join(__dirname, '../../public/templates/v1/template.handlebars'),
  'utf-8'
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
const parseToPDF = async (parsedHTML) => {
  const filename = Math.random().toString(36).substring(7);
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(parsedHTML, { waitUntil: 'networkidle0' });
  await page.emulateMedia('screen');
  await page.pdf({
    path: path.join(__dirname + '../../../public/tmp/' + filename + '.pdf'),
    printBackground: true,
    preferCSSPageSize: false,
  });

  return filename;
};

/**
 * Generates the PDF for a given reportuuid
 * @param {*} reportuuid
 */
const getPDF = async (reportuuid) => {
  // Get all necessary data
  const r = await getAllData(reportuuid);
  const s = parseToHTML({ ...r, host: process.env.HOST });
  const t = await parseToPDF(s);
  return t;
};

/**
 * Generates just the HTML for a given reportuuid
 * @param {*} reportuuid
 */
const getHTML = async (reportuuid) => {
  // Get all necessary data
  const r = await getAllData(reportuuid);
  const s = parseToHTML({ ...r, host: process.env.HOST });
  return s;
};

module.exports = {
  getPDF: getPDF,
  getHTML: getHTML,
};
