const { verify } = require("jsonwebtoken");
const db = require("../../../../models/index.js");
const {
  validateRefreshToken,
} = require("../../../validators/user.validator.js");
const {
  errorHelper,
  getText,
  ipHelper,
  signAccessToken,
  signRefreshToken,
} = require("../../../../utils/index.js");
const { refreshTokenSecretKey } = require("../../../../config/index.js");

let refreshToken = async (req, res) => {
  const { error } = validateRefreshToken(req.body);
  if (error)
    return res
      .status(400)
      .json(errorHelper("00059", req, error.details[0].message));

  try {
    req.user = verify(req.body.refreshToken, refreshTokenSecretKey);
    //  console.log(req.user);
  } catch (err) {
    return res.status(400).json(errorHelper("00063", req, err.message));
  }

  let userToken;
  try {
    userToken = await db.Token.findOne({
      where: {
        userId: req.user.id,
      },
      raw: true,
    });
    //  console.log(userToken);
  } catch (err) {
    return res.status(500).json(errorHelper("00060", req, err.message));
  }

  if (!userToken || userToken.refreshToken !== req.body.refreshToken)
    return res.status(404).json(errorHelper("00061", req));

  if (userToken.expiresIn <= Date.now() || !userToken.status)
    return res.status(400).json(errorHelper("00062", req));

  const accessToken = signAccessToken(req.user.id);
  const refreshToken = signRefreshToken(req.user.id);

  try {
    await db.Token.update(
      {
        refreshToken: refreshToken,
        status: true,
        expiresIn: Date.now() + 604800000,
        createdAt: Date.now(),
      },
      {
        where: {
          userId: req.user.id,
        },
      }
    );
  } catch (err) {
    return res.status(500).json(errorHelper("00063", req, err.message));
  }

  return res.status(200).json({
    resultMessage: { en: getText("en", "00065"), vn: getText("vn", "00065") },
    resultCode: "00065",
    accessToken,
    refreshToken,
  });
};

module.exports = refreshToken;

/**
 * @swagger
 * /user/refresh-token:
 *    post:
 *      summary: Refreshes the Access Token
 *      requestBody:
 *        description: Valid Refresh Token
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                refreshToken:
 *                  type: string
 *      tags:
 *        - User
 *      responses:
 *        "200":
 *          description: The token is refreshed successfully.
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
 *          description: Please provide refresh token.
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
