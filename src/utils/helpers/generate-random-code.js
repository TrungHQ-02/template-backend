const { generate } = require("randomstring");

let generateRandomCode = (length) => generate({ length, charset: "numeric" });
module.exports = generateRandomCode;
