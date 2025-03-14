const { body } = require("express-validator");

const userCreateValidator = [
    body("name")
    .notEmpty().withMessage("Name field is required")
    .isLength({ min: 3, max: 50}).withMessage("Username must be between 3 and 50 characters long")
    .matches(/^[a-zA-Z0-9 ]+$/).withMessage("Username can not contain special characters"),

    body("email")
    .notEmpty().withMessage("Email field is required")
    .isEmail().withMessage("Must be a valid email address")
    .normalizeEmail().withMessage("Email is invalid"),

    body("password")
    .notEmpty().withMessage("Password field is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
    .custom( value => {
        if (!/[a-z]/.test(value)) throw new Error("Invalid password");
        if (!/[A-Z]/.test(value)) throw new Error("Invalid password");
        if (!/[0-9]/.test(value)) throw new Error("Invalid password");
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) throw new Error("Invalid password");
        return true;
    })
];

module.exports = userCreateValidator;