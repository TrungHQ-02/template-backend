const nodemailer = require("nodemailer");
const getText = require("./lang/get_text.js");
const errorHelper = require("./helpers/error-helper.js");
const {
  mailUsername,
  mailPassword,
  mailHost,
  mailPort,
} = require("../config/index.js");

let sendCodeToEmail = (email, name, confirmCode, lang, type, req, res) => {
  new Promise(async (resolve, reject) => {
    if (!email || !confirmCode || (lang !== "vn" && lang !== "en")) {
      return res.status(400).send(errorHelper("00005", req)).end();
    }

    let transporter = nodemailer.createTransport({
      host: mailHost,
      port: mailPort,
      secure: false, // true for 465, false for other ports
      auth: {
        user: mailUsername,
        pass: mailPassword,
      },
    });

    let body = "";
    if (type == "register") {
      body = `${getText(lang, "welcomeCode")} ${name}!\r\n\r\n${getText(
        lang,
        "verificationCodeBody"
      )} ${confirmCode}`;
    } else {
      body = `${getText(lang, "verificationCodeBody")} ${confirmCode}`;
    }

    let mailOptions = {
      from: '"Crossplatform" <mightyxpress2@gmail.com>',
      to: email,
      subject: "From backend",
      text: body,
    };

    try {
      transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
          console.log("Error " + err);
        } else {
          console.log("Email sent successfully");
        }
      });
      return resolve("Success");
    } catch (err) {
      return reject(err);
    }
  });
};

module.exports = sendCodeToEmail;
