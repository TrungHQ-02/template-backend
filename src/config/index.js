const dotenv = require("dotenv");
dotenv.config();

const swaggerConfig = require("./swagger.config.json");

const {
  PORT,
  JWT_SECRET_KEY,
  REFRESH_TOKEN_SECRET_KEY,
  MAIL_USERNAME,
  MAIL_PASSWORD,
  MAIL_HOST,
  MAIL_PORT,
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID,
} = process.env;
const prefix = "/api";
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID,
};

// console.log(firebaseConfig);

module.exports = {
  port: PORT || 8080,
  prefix: prefix,
  jwtSecretKey: JWT_SECRET_KEY,
  refreshTokenSecretKey: REFRESH_TOKEN_SECRET_KEY,
  mailUsername: MAIL_USERNAME,
  mailPassword: MAIL_PASSWORD,
  mailHost: MAIL_HOST,
  mailPort: MAIL_PORT,
  apiSpecs: "/docs",
  swaggerConfig: swaggerConfig,
  firebaseConfig: firebaseConfig,
};
