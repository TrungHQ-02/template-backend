const en = require("./en.js");
const vn = require("./vn.js");

let getText = (lang, key) => {
  if (lang == "vn") {
    return vn[key];
  } else {
    return en[key];
  }
};

module.exports = getText;
