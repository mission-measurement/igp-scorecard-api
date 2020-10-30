const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

const reuploadScorecardService = require('../services/reuploadScorecardService');
const scorecardService = require('../services/scorecardService');

const sendPDF = async (req, res) => {
  const query = req.query;

  if (query.reportuuid) {
    const reportuuid = query.reportuuid;
    const filename = await scorecardService.getPDF(reportuuid);

    const stat = fs.statSync(path.join(__dirname + '../../../public/tmp/' + filename + '.pdf'))
    const stream = fs.createReadStream(
      path.join(__dirname + '../../../public/tmp/' + filename + '.pdf')
    );

    stream
      .on('data', function (chunk) {
      })
      .on('end', function () {
        res.end()
      })
      .on('close', function () {
        stream.destroy()
        fs.unlinkSync(path.join(__dirname + '../../../public/tmp/' + filename + '.pdf'))
      });

    res.writeHead(200, { 'Content-Type': 'application/pdf', 'Content-Size': stat.size });
    stream.pipe(res)
  } else {
    res.status(400).send("Error!")
  }
}

const sendPDFBatch = async (req, res) => {
  const portfolioid = req.query.portfolioid

  let filenames = await scorecardService.getPortfolioScorecards(portfolioid)

  if (filenames.length) {
    // create temporary folder
    const foldername = Math.random().toString(36).substring(7);
    fs.mkdirSync(path.join(__dirname + '../../../public/tmp/' + foldername))
    // iterate through the files and put them into a folder
    for (let i = 0; i < filenames.length; i++) {
      let filename = filenames[i]
      fs.renameSync(path.join(__dirname + '../../../public/tmp/' + filename + '.pdf'), path.join(__dirname + '../../../public/tmp/' + foldername + '/' + filename + '.pdf'))
    }

    exec_path = path.join(__dirname + '../../../public/tmp/' + foldername).replace(/ /g, '\\ ');
    child_process.execSync(`zip -j ${exec_path} ${exec_path}/*`);
    var stream = fs.createReadStream(`${path.join(__dirname + '../../../public/tmp/' + foldername)}.zip`);
    var stat = fs.statSync(`${path.join(__dirname + '../../../public/tmp/' + foldername)}.zip`);
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="archive.zip"');
    stream.pipe(res)

    stream.on('end', () => {
      fs.unlinkSync(path.join(__dirname + '../../../public/tmp/' + foldername + '.zip'))
      //fs.rmdirSync(path.join(__dirname + '../../../public/tmp/' + foldername), { recursive: true })
      //child_process.execSync(`rm -r ${exec_path}`)
    })

  } else {
    res.status(500).send("No scorecards for this portfolio")
  }

}

const sendHTML = async (req, res) => {
  const query = req.query;

  if (query.reportuuid) {
    const reportuuid = query.reportuuid;
    const html = await scorecardService.getHTML(reportuuid);
    res.send(html);
  } else {
    res.send('Not found');
  }
};

const generateScorecard = async (programreportuuid) => {
  const filename = await scorecardService.getPDF(programreportuuid, true);
  return path.join(__dirname + '../../../public/tmp/' + filename + '.pdf');
};

const reuploadScorecard = async (req, res) => {
  const query = req.query;

  if (query.programreportid) {
    let programreportid = query.programreportid
    let location = await reuploadScorecardService.reuploadScorecard(programreportid)
    res.send({ url: location })
  } else {
    res.status(400).send('Missing programreportid')
  }

}

module.exports = {
  sendPDF: sendPDF,
  sendHTML: sendHTML,
  sendPDFBatch: sendPDFBatch,
  generateScorecard: generateScorecard,
  reuploadScorecard: reuploadScorecard
};
