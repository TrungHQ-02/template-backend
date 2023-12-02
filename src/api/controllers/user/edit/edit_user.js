const db = require("../../../../models/index.js");
const { validateEditUser } = require("../../../validators/user.validator.js");
const { errorHelper, logger, getText } = require("../../../../utils/index.js");
const { firebaseConfig } = require("../../../../config/index.js");

const { initializeApp } = require("firebase/app");

const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");
let editUser = async (req, res) => {
  const { error } = validateEditUser(req.body);
  console.log(error);
  if (error) {
    let code = "00077";
    const message = error.details[0].message;
    if (message.includes("gender")) code = "00078";
    else if (message.includes("language")) code = "00079";
    else if (message.includes("birthDate")) code = "00080";
    else if (message.includes("username")) code = "00081";
    return res.status(400).json(errorHelper(code, req, message));
  }

  let user = "";
  try {
    user = await db.User.findOne({
      where: {
        id: req.user.id,
      },
    });
  } catch (err) {
    return res.status(500).json(errorHelper("00082", req, err.message));
  }

  if (req.body.name) user.name = req.body.name;
  if (req.body.gender) user.gender = req.body.gender;
  if (req.body.birthDate) user.birthDate = req.body.birthDate;
  if (req.body.language) user.language = req.body.language;
  if (req.body.username && req.body.username !== user.username) {
    let existUsername = "";
    try {
      existUsername = (await db.User.findOne({
        where: {
          username: req.body.username,
        },
      }))
        ? 1 // username exist
        : 0; // username not exist
    } catch (err) {
      return res.status(500).json(errorHelper("00083", req, err.message));
    }

    if (existUsername == 1)
      return res.status(400).json(errorHelper("00084", req));
    else {
      user.username = req.body.username;
    }
  }
  let hasError = false;
  if (req.file) {
    initializeApp(firebaseConfig);
    const storage = getStorage();
    const dateTime = giveCurrentDateTime();

    const storageRef = ref(storage, `${user.id}/${dateTime}`);

    const metadata = {
      contentType: req.file.mimetype,
    };

    console.log(metadata);

    try {
      const snapshot = await uploadBytesResumable(
        storageRef,
        req.file.buffer,
        metadata
      );

      user.photoUrl = await getDownloadURL(snapshot.ref);
      // console.log(user.photoUrl);
      // console.log("File successfully upload");
    } catch (err) {
      hasError = true;
      return res.status(500).json(errorHelper("00087", req, err.message)).end();
    }
  }

  if (!hasError) {
    try {
      await user.save();
    } catch (err) {
      return res.status(500).json(errorHelper("00085", req, err.message));
    }

    logger("00086", req.user.id, getText("en", "00086"), "Info", req);
    return res.status(200).json({
      resultMessage: { en: getText("en", "00086"), vn: getText("vn", "00086") },
      resultCode: "00086",
      photoUrl: user.photoUrl,
    });
  }
};

const giveCurrentDateTime = () => {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + " " + time;
  return dateTime;
};

module.exports = editUser;

/**
 * @swagger
 * /user:
 *    put:
 *      summary: Edit the Profile Information
 *      parameters:
 *        - in: header
 *          name: Authorization
 *          schema:
 *            type: string
 *          description: Put access token here
 *        - in: formData
 *          name: image
 *          required: false
 *          schema:
 *            type: file
 *          description: Image file here
 *      requestBody:
 *        description: Some of the user profile information to change
 *        required: false
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                username:
 *                  type: string
 *                language:
 *                  type: string
 *                  enum: ['tr', 'en']
 *                gender:
 *                  type: string
 *                  enum: ['male', 'female', 'other']
 *                birthDate:
 *                  type: string
 *      tags:
 *        - User
 *      responses:
 *        "200":
 *          description: Your profile information was changed successfully.
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          resultMessage:
 *                              $ref: '#/components/schemas/ResultMessage'
 *                          resultCode:
 *                              $ref: '#/components/schemas/ResultCode'
 *                          photoUrl:
 *                              type: string
 *        "400":
 *          description: Please provide valid values for each key you want to change.
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
