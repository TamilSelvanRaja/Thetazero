
const MY_PORT = 5000;
const MANGODB_URL = "mongodb://ponmozhi31:8rsooF2MSoXwZuUC@cluster0-shard-00-02.5gy5v.mongodb.net:27017/eventapp?ssl=true&authSource=admin";
const SECRET_KEY = "creatink@event*app*2024";

//********************************************************************\\
//***************** Email Services Connection Keys *******************\\
//********************************************************************\\
const EMAIL_HOST = 'smtp.zeptomail.com';
const EMAIL_PORT = 587;
const EMAIL_USER = 'emailapikey';
const EMAIL_PASS = 'wSsVR60k/xH5Xa19zTarIe88nFVcVA/0QRl5jASg6iKtH6rK8cdpkE3LVwOjSaUXEzQ8RTIXpu58n0oDhzIJjN17y15WCSiF9mqRe1U4J3x17qnvhDzNV2lbkxuKL4MJxQlumGVgEM4j+g==';
const EMAIL_FROM = 'noreply@eventink.in';

module.exports = {
    MY_PORT: MY_PORT,
    MANGODB_URL: MANGODB_URL,
    SECRET_KEY: SECRET_KEY,
    EMAIL_HOST: EMAIL_HOST,
    EMAIL_PORT: EMAIL_PORT,
    EMAIL_USER: EMAIL_USER,
    EMAIL_PASS: EMAIL_PASS,
    EMAIL_FROM: EMAIL_FROM
};

