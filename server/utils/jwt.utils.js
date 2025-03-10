const { sign } = require("jsonwebtoken");
const fs = require('fs');
const path = require("path");

const createAccessToken = userId => {
    return sign({ userId }, fs.readFileSync(path.join(__dirname, '../priv.pem'), 'utf8'), {
        expiresIn: '5m',
        algorithm: 'RS256'
    })
}

const createRefreshToken = userId => {
    return sign({ userId }, fs.readFileSync(path.join(__dirname, "../priv.pem"), 'utf8'), {
        expiresIn: '7d',
        algorithm: 'RS256'
    })
}

module.exports = { createAccessToken, createRefreshToken };