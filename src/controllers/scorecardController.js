const scorecardService = require('../services/scorecardService');
const fs = require('fs');
const path = require('path');

const sendPDF = async (req, res) => {
  const query = req.query;

  if (query.reportuuid) {
    const reportuuid = query.reportuuid;
    const filename = await scorecardService.getPDF(reportuuid);
    const stream = fs.createReadStream(
      path.join(__dirname + '../../../public/tmp/' + filename + '.pdf')
    );

    await res.contentType('application/pdf');
    stream.pipe(res).once('close', function () {
      stream.destroy(); // makesure stream closed, not close if download aborted.
      fs.unlink(
        path.join(__dirname + '../../../public/tmp/' + filename + '.pdf'),
        function (err) {
          if (err) {
            console.error(err.toString());
          } else {
            console.warn(filename + ' deleted');
          }
        }
      );
    });
  } else {
    res.send('Not found');
  }
};

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
  const filename = await scorecardService.getPDF(programreportuuid);
  return path.join(__dirname + '../../../public/tmp/' + filename + '.pdf');
};

module.exports = {
  sendPDF: sendPDF,
  sendHTML: sendHTML,
  generateScorecard: generateScorecard,
};
