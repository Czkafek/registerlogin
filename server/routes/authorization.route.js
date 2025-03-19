const express = require("express");
const router = express.Router();
const { verify } = require("jsonwebtoken");
const { createAccessToken, createRefreshToken } = require("../utils/jwt.utils.js");
const fs = require('fs');
const path = require('path');
const User = require("../models/user.model.js");

router.get('/protected', async (req, res) => {
    try {
        const authorization = req.headers['authorization'];
        if (!authorization) throw new Error("You need to login");
        const token = authorization.split(' ')[1];
        const { userId } = verify(token, fs.readFileSync(path.join(__dirname, '../priv.pem'), 'utf8'));
        if (userId !== null) res.status(200).json({ error: "This is protected data" });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.post('/refresh_token', async (req, res) => {
    const token = req.cookies.refreshtoken;
    console.log("Cookies received:", req.cookies);
    if (!token) return res.status(401).json({ error: "cookies error", accesstoken: '' });
    let payload = null;
    try {
        payload = verify(token, fs.readFileSync(path.join(__dirname, "../priv.pem"), 'utf8'));
    } catch (err) {
        res.status(500).json({ error: err });
    }
    console.log(payload);
    const user = await User.findById(payload.userId);
    if (!user) return res.status(401).json({ error: 'user error', accesstoken: ''});
    if (user.refreshToken !== token) return res.status(401).json({ error: 'database error', accesstoken: '' });
    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();
    res.cookie('refreshtoken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 7*24*60*60*1000,
        path: '/'
    });
    res.status(200).json({ accessToken });
});

module.exports = router;