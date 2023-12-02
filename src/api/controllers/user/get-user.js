const db = require("../../../models/index.js");

const { errorHelper, logger, getText } = require("../../../utils/index.js");

let getUser = async (req, res) => {
  let user = "";
  try {
    user = await db.User.findOne({
      where: {
        id: req.user.id,
      },
    });
  } catch (err) {
    return res.status(500).json(errorHelper("00088", req, err.message));
  }

  logger("00089", req.user.id, getText("en", "00089"), "Info", req);
  return res.status(200).json({
    resultMessage: { en: getText("en", "00089"), vn: getText("vn", "00089") },
    resultCode: "00089",
    user,
  });
};

module.exports = getUser;
