let getIP = (req) =>
  req.headers["x-forwarded-for"]
    ? req.headers["x-forwarded-for"].split(/, /)[0]
    : req.connection.remoteAddress;

module.exports = getIP;
