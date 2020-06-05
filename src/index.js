require('dotenv').config();
const path = require('path');
const express = require('express');
const router = require('./routes/router');
const cors = require('cors');
const logger = require('morgan');

const app = express();
const PORT = 3006 || process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(logger('dev'));

// public assets (html, css, img)
app.use('/scorecard/public', express.static(path.join(__dirname, '../public')));
// scorecards
app.use('/', router);

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
