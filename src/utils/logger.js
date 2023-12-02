const db = require("../models/index.js");
const getIP = require("./helpers/get-ip-helper.js");
let logger = async (code, userId, errorMessage, level, req) => {
  let ip = "no-ip";
  if (req !== "") ip = getIP(req);
  let log = await db.Log.create({
    userId: userId !== "" && userId ? userId : "",
    resultCode: code,
    level: level,
    errorMessage: errorMessage,
    ip: ip,
  });
};

module.exports = logger;
