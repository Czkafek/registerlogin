const express = require("express");
const router = express.Router();
const User = require('../models/user.model.js');
const { genPassword, verifyPassword } = require("../utils/password.utils.js");
const userCreateValidator = require("../validation/userCreate.validation.js");
const checkValidation = require("../validation/check.validation.js");

router.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.post('/create', userCreateValidator, checkValidation, async (req, res) => {
    try {
        const isTaken = await User.find( {$or: [{ name: req.body.name }, { email: req.body.email }]});
        if(isTaken.length > 0) return res.status(409).json({ message: "Username or email already taken"});
        await User.create({ name: req.body.name, password: await genPassword(req.body.password), email: req.body.email });
        res.status(200).json({ message: "User has been successfully created" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;