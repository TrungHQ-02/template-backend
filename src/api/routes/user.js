const express = require("express");
const {
  login,
  logout,
  register,
  refreshToken,
  sendVerificationCode,
  forgotPassword,
  verifyEmail,
  getUser,
  changePassword,
  editUser,
  deleteUser,
} = require("../controllers/user/index.js");

const { auth, imageUpload } = require("../middlewares/index.js");

let router = express.Router();

router.post("/", register);
router.post("/login", login);
router.post("/logout", auth, logout);
router.post("/verify-email", verifyEmail);
router.post("/refresh-token", refreshToken);
router.post("/forgot-password", auth, forgotPassword);
router.post("/send-verification-code", sendVerificationCode);

router.post("/change-password", auth, changePassword);
router.put("/", auth, imageUpload, editUser);
router.get("/", auth, getUser);
router.delete("/", auth, deleteUser);

module.exports = router;
