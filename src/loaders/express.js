const express = require("express");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");
const helmet = require("helmet");
const { prefix } = require("./../config/index.js");
const { jwtSecretKey } = require("../config/index.js");
const bodyParser = require("body-parser");

const { logger } = require("../utils/index.js");
const routes = require("./../api/routes/index.js");

let expressLoader = (app) => {
  process.on("uncaughtException", async (error) => {
    // console.log(error);
    logger("00001", "", error.message, "Uncaught Exception", "");
  });

  process.on("unhandledRejection", async (ex) => {
    // console.log(ex);
    logger("00002", "", ex.message, "Unhandled Rejection", "");
  });

  if (!jwtSecretKey) {
    logger("00003", "", "Jwtprivatekey is not defined", "Process-Env", "");
    process.exit(1);
  }

  app.enable("trust proxy");
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(morgan("dev"));
  app.use(helmet());
  app.use(compression());
  app.use(express.static("public"));
  app.disable("x-powered-by");
  app.disable("etag");

  app.use(prefix, routes);

  app.get("/", (_req, res) => {
    return res
      .status(200)
      .json({
        resultMessage: {
          en: "Project is successfully working...",
          vn: "Project đang chạy",
        },
        resultCode: "00004",
      })
      .end();
  });

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Content-Security-Policy-Report-Only", "default-src: https:");
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT POST PATCH DELETE GET");
      return res.status(200).json({});
    }
    next();
  });

  app.use((_req, _res, next) => {
    const error = new Error("Endpoint could not find!");
    error.status = 404;
    next(error);
  });

  app.use((error, req, res, _next) => {
    res.status(error.status || 500);
    let resultCode = "00015";
    let level = "External Error";
    if (error.status === 500) {
      resultCode = "00013";
      level = "Server Error";
    } else if (error.status === 404) {
      resultCode = "00014";
      level = "Client Error";
    }
    logger(resultCode, req?.user?.id ?? "", error.message, level, req);
    return res.json({
      resultMessage: {
        en: error.message,
        vn: error.message,
      },
      resultCode: resultCode,
    });
  });
};

module.exports = expressLoader;
