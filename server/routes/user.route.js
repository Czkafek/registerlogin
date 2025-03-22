const express = require("express");
const router = express.Router();
const User = require('../models/user.model.js');
const { genPassword, verifyPassword } = require("../utils/password.utils.js");
const userCreateValidator = require("../validation/userCreate.validation.js");
const userLoginValidation = require("../validation/userLogin.validation.js");
const checkValidation = require("../validation/check.validation.js");
const { createAccessToken, createRefreshToken, authorize } = require("../utils/jwt.utils.js");
const fs = require('fs');
const path = require('path');


router.get('/', authorize, async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.post('/register', userCreateValidator, checkValidation, async (req, res) => {
    try {
        const isTaken = await User.find( {$or: [{ name: req.body.name }, { email: req.body.email }]});
        if(isTaken.length > 0) return res.status(409).json({ error: "Username or email already taken"});
        await User.create({ name: req.body.name, password: await genPassword(req.body.password), email: req.body.email });
        res.status(200).json({ error: "User has been successfully created" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/login', userLoginValidation, checkValidation, async (req, res) => {
    try {
        const user = await User.findOne({ name: req.body.login });
        if(!user) return res.status(404).json({ error: "Invalid username/email" });
        if(!await verifyPassword(req.body.password, user.password)) return res.status(401).json({ error: "Invalid password" });
        const accessToken = createAccessToken(user._id);
        const refreshToken = createRefreshToken(user._id);
        user.refreshToken = refreshToken;
        await user.save();
        res.cookie('refreshtoken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7*24*60*60*1000,
            path: '/auth'
        });
        console.log("Cookie set in login:", refreshToken.substring(0, 15) + "...");
        res.status(200).json({ accessToken, error: "User has been successfully logged in" });
    } catch (err) {
        res.status(500).json({ error: err.error });
    }
});

router.post('/logout', async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.body.id, {
            refreshToken: null
        });
        res.clearCookie('refreshtoken');
        return res.json({ error: "User has been logged out" });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});




module.exports = router;