const db = require("../../../../models/index.js");

const {
  validateVerifyEmail,
} = require("../../../validators/user.validator.js");
const {
  errorHelper,
  logger,
  getText,
  signAccessToken,
  signRefreshToken,
} = require("../../../../utils/index.js");
const getIP = require("../../../../utils/helpers/get-ip-helper.js");

const { jwtSecretKey } = require("../../../../config/index.js");
const pkg = require("jsonwebtoken");
const { verify } = pkg;

let verifyEmail = async (req, res) => {
  const { error } = validateVerifyEmail(req.body);
  if (error)
    return res
      .status(400)
      .json(errorHelper("00053", req, error.details[0].message));

  try {
    req.user = verify(req.body.token, jwtSecretKey);
  } catch (err) {
    return res.status(400).json(errorHelper("00055", req, err.message));
  }

  let user;
  try {
    user = await db.User.findOne({
      where: {
        id: req.user.id,
        isActivated: true,
      },
    });

    // console.log(user);
  } catch (err) {
    return res.status(500).json(errorHelper("00051", req, err.message));
  }

  if (user == null) return res.status(400).json(errorHelper("00052", req));

  if (req.body.code !== req.user.code)
    return res.status(400).json(errorHelper("00054", req));

  try {
    await db.User.update(
      {
        isVerified: true,
      },
      {
        where: {
          id: req.user.id,
        },
      }
    );
  } catch (err) {
    return res.status(500).json(errorHelper("00056", req, err.message));
  }

  const accessToken = signAccessToken(req.user.id);
  const refreshToken = signRefreshToken(req.user.id);

  try {
    let token = await db.Token.findOne({
      where: {
        userId: req.user.id,
      },
    });
    // console.log(token);

    if (token == null) {
      let newToken = await db.Token.create({
        userId: req.user.id,
        refreshToken: refreshToken,
        status: true,
        expiresIn: Date.now() + 604800000,
        createdAt: Date.now(),
        createdByIp: getIP(req),
      });

      // console.log(newToken);
    } else {
      await db.Token.update(
        {
          userId: req.user.id,
          refreshToken: refreshToken,
          status: true,
          expiresIn: Date.now() + 604800000,
          createdAt: Date.now(),
          createdByIp: getIP(req),
        },
        {
          where: {
            userId: req.user.id,
          },
        }
      );
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(errorHelper("00057", req, err.message));
  }

  logger("00058", req.user.id, getText("en", "00058"), "Info", req);
  return res.status(200).json({
    resultMessage: { en: getText("en", "00058"), vn: getText("vn", "00058") },
    resultCode: "00058",
    accessToken,
    refreshToken,
  });
};

module.exports = verifyEmail;

/**
 * @swagger
 * /user/verify-email:
 *    post:
 *      summary: Verifies the email address of the user.
 *      requestBody:
 *        description: Confirm code and confirm token.
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *                code:
 *                  type: string
 *      tags:
 *        - User
 *      responses:
 *        "200":
 *          description: Your email address was verified successfully.
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          resultMessage:
 *                              $ref: '#/components/schemas/ResultMessage'
 *                          resultCode:
 *                              $ref: '#/components/schemas/ResultCode'
 *                          accessToken:
 *                              type: string
 *                          refreshToken:
 *                              type: string
 *        "400":
 *          description: Please send a verification code.
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
