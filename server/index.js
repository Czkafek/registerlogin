const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;
const URI = "mongodb://localhost:27017/loginregister";
const cors = require('cors');

const userRoute = require("./routes/user.route.js");
const authorizationRoute = require("./routes/authorization.route.js");

app.use(cors({ 
    origin: "http://localhost:5173", 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

// ROUTES
app.use("/api", userRoute);
app.use("/auth", authorizationRoute);

mongoose.connect(URI)
.then(() => console.log("Successfully connected to MongoDB"))
.catch( err => console.log(err));

app.listen(port, () => {
    console.log("Server is running at http://localhost:3000");
});

app.get("/", (req, res) => {
    res.send("Hello there");
})

app.get('/test-cookie', (req,res) => {
    res.cookie('testcookie', 'testvalue', {
        httpOnly: true,
        secure: false,
        path: '/'
    });
    res.send("Test cookie set");
});
app.get("/check-cookies", (req, res) => {
    console.log("All cookies: ", req.cookies);
    res.json({ cookies: req.cookies });
})
