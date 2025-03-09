const bcrypt = require("bcrypt");
const { verify, sign } = require("jsonwebtoken");
const fs = require('fs');
const path = require("path");

const createAccessToken = userId => {
    return sign({ userId }, fs.readFileSync(path.join(__dirname, '../priv.pem')), 'utf8', {
        expiresIn: '5m',
        algorithm: 'RS254'
    })
}