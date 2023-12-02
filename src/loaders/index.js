const sequelizeLoader = require("./connectDB.js");
const expressLoader = require("./express.js");

let loader = async (app) => {
  await sequelizeLoader();
  expressLoader(app);
};

module.exports = loader;
