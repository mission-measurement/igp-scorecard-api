const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

const uploadScorecard = async (programreportid, filename) => {
  try {
    let data = new FormData();
    data.append("scorecard", fs.createReadStream(filename));
    let config = {
      method: "post",
      url: `${process.env.API_HOST}/aws/programreports/scorecard?programreportid=${programreportid}`,
      headers: {
        Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
        ...data.getHeaders(),
      },
      data: data,
    };
    let r = await axios(config);
    return r.data; // returns obj with prop location, filename and programreportuuid
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  uploadScorecard,
};
