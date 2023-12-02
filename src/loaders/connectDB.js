const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("crossplatform", "root", null, {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

let sequelizeLoader = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection to database has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = sequelizeLoader;
