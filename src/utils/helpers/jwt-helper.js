const pkg = require("jsonwebtoken");
const { sign } = pkg;
const {
  jwtSecretKey,
  refreshTokenSecretKey,
} = require("../../config/index.js");

function signAccessToken(userId) {
  const accessToken = sign({ id: userId }, jwtSecretKey, {
    expiresIn: "6h",
  });
  return accessToken;
}
function signRefreshToken(userId) {
  const refreshToken = sign({ id: userId }, refreshTokenSecretKey, {
    expiresIn: "7d",
  });
  return refreshToken;
}
function signConfirmCodeToken(userId, confirmCode) {
  const confirmCodeToken = sign(
    { id: userId, code: confirmCode },
    jwtSecretKey,
    {
      expiresIn: "5m",
    }
  );
  return confirmCodeToken;
}

module.exports = {
  signAccessToken: signAccessToken,
  signRefreshToken: signRefreshToken,
  signConfirmCodeToken: signConfirmCodeToken,
};
