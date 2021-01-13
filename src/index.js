require('dotenv').config();
const path = require('path');
const express = require('express');
const router = require('./routes/router');
const cors = require('cors');
const logger = require('morgan');

const app = express();
const PORT = 3000 || process.env.PORT;


var openPaths = ["/scorecard/healthy"];
var authCheck = (req, res, next) => {
  var path = req._parsedUrl.pathname;
  if (openPaths.includes(path)) {
    next();
  } else {
    auth.authenticateToken(req, res, next);
  }
};


app.get("/scorecard/healthy", (req, res) => {
    res.status(200).send("Healthy!");
  });


app.use(express.json());
app.use(cors());
//app.use(logger('dev'));
app.use(
    logger('combined', {
      skip: function(req, res) {
        return res.statusCode < 400;
      }
    })
  );

// public assets (html, css, img)
app.use('/public', express.static(path.join(__dirname, '../public')));
// scorecards
app.use('/', router);

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
