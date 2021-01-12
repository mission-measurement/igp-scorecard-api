const success = (res, msg, obj) => {
  if (msg === undefined) {
    msg = 'API Success';
  }
  if (obj !== undefined) {
    return res.status(200).send(obj);
  } else {
    console.log('success', msg);
    return res.status(200).send({ message: msg });
  }
};

const error = (res, err) => {
  console.log(err);
  return res.status(500).json({ message: 'An error has occured' });
};

const unauthorized = res => {
  console.log(res);
  return res.status(401).json({ message: 'Unauthorized' });
};

module.exports = {
  success,
  error,
  unauthorized
};
