const { body, oneOf } = require("express-validator");

const userLoginValidation = [
    body("password")
    .notEmpty().withMessage("Password field is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
    .custom( value => {
        if (!/[a-z]/.test(value)) throw new Error("Invalid password");
        if (!/[A-Z]/.test(value)) throw new Error("Invalid password");
        if (!/[0-9]/.test(value)) throw new Error("Invalid password");
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) throw new Error("Invalid password");
        return true;
    }),

    oneOf([
        // Walidacja dla email
        body("login")
          .isEmail()
          .withMessage("Podaj prawidłowy adres email"),
        
        // Walidacja dla username - upewnij się, że NIE jest emailem i spełnia inne wymagania
        body("login")
          .not().isEmail()
          .withMessage("Nazwa użytkownika nie może być w formacie email")
          .isLength({ min: 3 })
          .withMessage("Nazwa użytkownika musi mieć co najmniej 3 znaki")
          // Możesz dodać więcej reguł dla username, np.:
          .matches(/^[a-zA-Z0-9_]+$/)
          .withMessage("Nazwa użytkownika może zawierać tylko litery, cyfry i podkreślenia")
      ], "Podaj prawidłowy email lub nazwę użytkownika"),
];

module.exports = userLoginValidation;