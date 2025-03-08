const bcrypt = require("bcrypt");

async function genPassword(password) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
}

async function verifyPassword(reqPassword, userPassword) {
    return await bcrypt.compare(reqPassword, userPassword);
}

module.exports = { genPassword, verifyPassword };