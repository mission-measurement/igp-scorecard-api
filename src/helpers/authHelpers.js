const jwt = require('jsonwebtoken');

var JWT_KEY =
  '2CCB18BDE93F1B6F8297DC736F7ECEF3754E2A8C66D3BDFA70B3E5CE4A3A88B9';

// middleware for requests that require authentication. verifies token and adds userId to request
function authenticateToken(req, res, next) {
  // note: frontend fetch() lowercases all header names, so we need the 'authorization' not 'Authorization' header
  var tokenStr = req.headers['Authorization'];
  if (!tokenStr) {
    tokenStr = req.headers['authorization'];
  }

  if (!tokenStr) {
    return res
      .status(401)
      .send({ message: 'Authorization Token is Required.' });
  } else if (!tokenStr.startsWith('Bearer ')) {
    // should be of the form Bearer: xxxx...

    return res
      .status(401)
      .send({ message: 'Authorization token badly formatted' });
  } else {
    token = tokenStr.split(' ')[1];
  }

  jwt.verify(token, JWT_KEY, function (err, decoded) {
    if (err) {
      if (err.name == 'TokenExpiredError') {
        return res.status(401).send({
          message: 'Authorization token expired, you must login again',
        });
      }
      return res
        .status(401)
        .send({ message: 'Failed to authenticate authorization token' });
    }

    // if everything good, save to request for use in other routes
    console.log('token verified');
    next();
  });
}

module.exports = {
  authenticateToken,
};
