const logger = require("../logger.js");
const en = require("../lang/en.js");
const vn = require("../lang/vn.js");

let errorHelper = (code, req, errorMessage) => {
  let key = code;
  if (!en[code]) key = "00008";
  let userId = "";
  if (req && req.user) userId = req.user.id;

  const enMessage = en[key];
  const vnMessage = vn[key];

  if (enMessage.includes("server error")) {
    logger(code, userId, errorMessage, "Server Error", req);
  } else {
    logger(code, userId, errorMessage ?? enMessage, "Client Error", req);
  }

  return {
    resultMessage: {
      en: enMessage,
      vn: vnMessage,
    },
    resultCode: code,
  };
};

module.exports = errorHelper;
