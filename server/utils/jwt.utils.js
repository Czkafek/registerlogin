const { sign, verify } = require("jsonwebtoken");
const fs = require('fs');
const path = require("path");
const User = require("../models/user.model.js");

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

const authorize = (req, res, next) => {
    try {
        const authorization = req.headers['authorization'];
        if (!authorization) throw new Error("You need to login");
        const token = authorization.split(' ')[1];
        
        try {
            const { userId } = verify(token, fs.readFileSync(path.join(__dirname, '../priv.pem'), 'utf8'));
            req.userId = userId;
            next();
        } catch (err) {
            res.status(401).json({ error: "Token expired", needRefresh: true });
        }
    } catch (err) {
        res.status(401).json({ error: err });
    }
}

module.exports = { createAccessToken, createRefreshToken, authorize };