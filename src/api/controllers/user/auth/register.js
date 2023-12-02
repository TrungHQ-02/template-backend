const db = require("../../../../models/index.js");

const { validateRegister } = require("../../../validators/user.validator.js");
const {
  errorHelper,
  generateRandomCode,
  sendCodeToEmail,
  logger,
  getText,
  signConfirmCodeToken,
} = require("../../../../utils/index.js");
const getIP = require("../../../../utils/helpers/get-ip-helper.js");
const bcrypt = require("bcryptjs");
// const { hash } = bcrypt;
const geoip = require("geoip-lite");
const { lookup } = geoip;

let register = async (req, res) => {
  const { error } = validateRegister(req.body);
  if (error) {
    let code = "00025";
    if (error.details[0].message.includes("email")) code = "00026";
    else if (error.details[0].message.includes("password")) code = "00027";
    else if (error.details[0].message.includes("name")) code = "00028";

    return res
      .status(400)
      .json(errorHelper(code, req, error.details[0].message));
  }

  try {
    const exists = await db.User.findOne({
      where: {
        email: req.body.email,
      },
    });

    // console.log(exists);
    if (exists != null) return res.status(409).json(errorHelper("00032", req));
  } catch (err) {
    return res.status(500).json(errorHelper("00031", req, err.message));
  }

  //   const hashed = await hash(req.body.password, 10);

  const emailCode = generateRandomCode(4);
  await sendCodeToEmail(
    req.body.email,
    req.body.name,
    emailCode,
    req.body.language,
    "register",
    req,
    res
  );

  let username = "";
  let tempName = "";
  let existsUsername = "";
  let name = req.body.name;
  if (name.includes(" ")) {
    tempName = name.trim().split(" ").slice(0, 1).join("").toLowerCase();
  } else {
    tempName = name.toLowerCase().trim();
  }
  do {
    username = tempName + generateRandomCode(4);
    try {
      existsUsername = await db.User.findOne({
        where: {
          username: username,
        },
      });
    } catch (err) {
      return res.status(500).json(errorHelper("00033", req, err.message));
    }
  } while (existsUsername != null);

  const geo = lookup(getIP(req));
  // console.log(geo);

  user = "";
  try {
    user = await db.User.create({
      email: req.body.email,
      password: req.body.password,
      name: name,
      username: username,
      language: req.body.language,
      platform: req.body.platform,
      isVerified: false,
      countryCode: geo ? geo : "US",
      timezone: req.body.timezone ? req.body.timezone : "",
    });
  } catch (err) {
    return res.status(500).json(errorHelper("00034", req, err.message));
  }

  user.password = null;

  const confirmCodeToken = signConfirmCodeToken(user.id, emailCode);

  logger("00035", user.id, getText("en", "00035"), "Info", req);
  return res.status(200).json({
    resultMessage: { en: getText("en", "00035"), vn: getText("vn", "00035") },
    resultCode: "00035",
    user,
    confirmToken: confirmCodeToken,
  });
};

module.exports = register;

/**
 * @swagger
 * /user:
 *    post:
 *      summary: Registers the user
 *      requestBody:
 *        description: All required information about the user
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *                name:
 *                  type: string
 *                language:
 *                  type: string
 *                  enum: ['tr', 'en']
 *                platform:
 *                  type: string
 *                  enum: ['Android', 'IOS']
 *                timezone:
 *                  type: number
 *                deviceId:
 *                  type: string
 *      tags:
 *        - User
 *      responses:
 *        "200":
 *          description: You registered successfully.
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          resultMessage:
 *                              $ref: '#/components/schemas/ResultMessage'
 *                          resultCode:
 *                              $ref: '#/components/schemas/ResultCode'
 *                          user:
 *                              $ref: '#/components/schemas/User'
 *                          confirmToken:
 *                              type: string
 *        "400":
 *          description: Please provide all the required fields!
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Result'
 *        "500":
 *          description: An internal server error occurred, please try again.
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Result'
 */
