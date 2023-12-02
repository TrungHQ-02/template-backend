const db = require("../../../models/index.js");
const { errorHelper } = require("../../../utils/index.js");
const { jwtSecretKey } = require("../../../config/index.js");
const jwt = require("jsonwebtoken");

const { verify } = jwt;

let auth = async (req, res, next) => {
  let token = req.header("Authorization");

  //   no token provided
  if (!token) return res.status(401).json(errorHelper("00006", req));

  if (token.includes("Bearer"))
    token = req.header("Authorization").replace("Bearer ", "");

  try {
    req.user = verify(token, jwtSecretKey);

    try {
      // check if user exist
      const exists = await db.User.findOne({
        where: {
          id: req.user.id,
          isVerified: true,
        },
      });

      if (!exists) {
        // user doesnt exist
        return res.status(400).json(errorHelper("00009", req));
      }
    } catch (err) {
      // server error
      return res.status(500).json(errorHelper("00008", req, err.message));
    }

    try {
      // check if refresh token exist
      const tokenExists = await db.Token.findOne({
        where: {
          userId: req.user.id,
          status: true,
        },
      });

      if (!tokenExists) {
        // token doesnt exist
        return res.status(401).json(errorHelper("00011", req));
      }
    } catch (err) {
      // server error
      return res.status(500).json(errorHelper("00010", req, err.message));
    }
    next();
  } catch (err) {
    return res.status(401).json(errorHelper("00012", req, err.message));
  }
};
module.exports = auth;
