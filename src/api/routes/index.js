const express = require("express");
const swagerJsdoc = require("swagger-jsdoc");
const { serve, setup } = require("swagger-ui-express");
const user = require("./user.js");
const { apiSpecs, swaggerConfig } = require("../../config/index.js");

let router = express.Router();

const specDoc = swagerJsdoc(swaggerConfig);

router.use(apiSpecs, serve);
router.get(apiSpecs, setup(specDoc, { explorer: true }));

router.use("/user", user);

module.exports = router;
