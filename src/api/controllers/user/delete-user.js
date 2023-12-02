const db = require("../../../models/index.js");

const {
  errorHelper,
  logger,
  getText,
  generateRandomCode,
} = require("../../../utils/index.js");

// const bcrypt = require("bcryptjs");
// const { hash } = bcrypt;

let deleteUser = async (req, res) => {
  const anon = "anon" + generateRandomCode(8);
  // const hashed = await hash(anon, 10);
  try {
    await db.User.update(
      {
        name: anon,
        username: anon,
        email: anon + "@anon.com",
        password: anon,
        photoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1200px-Node.js_logo.svg.png",
        isActivated: false,
      },
      {
        where: {
          id: req.user.id,
        },
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json(errorHelper("00090", req, err.message));
  }

  try {
    await db.Token.destroy({
      where: {
        userId: req.user.id,
      },
    });
  } catch (err) {
    return res.status(500).json(errorHelper("00091", req, err.message));
  }

  logger("00092", req.user.id, getText("en", "00092"), "Info", req);
  return res.status(200).json({
    resultMessage: { en: getText("en", "00092"), vn: getText("vn", "00092") },
    resultCode: "00092",
  });
};

module.exports = deleteUser;

/**
 * @swagger
 * /user:
 *    delete:
 *      summary: Delete the User
 *      parameters:
 *        - in: header
 *          name: Authorization
 *          schema:
 *            type: string
 *          description: Put access token here
 *      tags:
 *        - User
 *      responses:
 *        "200":
 *          description: Your account was deleted successfully.
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Result'
 *        "401":
 *          description: Invalid token.
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
