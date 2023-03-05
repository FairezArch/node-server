const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

// logger and handler error
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");

// Connect DB
const mongoose = require('mongoose')
const connectDB = require('./config/dbConfig')

// Set PORT
const { port } = require('./config/app')
const PORT = port || 3500;

// Route
const rootRouter = require("./routes/web/root");
const employeeRouter = require("./routes/api/employees");
const authRouter = require("./routes/api/auth");
const refreshTokenRouter = require("./routes/api/refresh");

//JWT
const verifyToken = require('./middleware/verifyJWT');

//Cookie and credential
const cookies = require("cookie-parser");
const checkCredential = require('./middleware/credentials')


// Connect to mongodb
connectDB()

// Custo middlware logger
app.use(logger);

//Handle credential chck before - CORS then fetch cookies credential requirement
app.use(checkCredential)

// Cross Origin Resource Sharing
const corsOptions = require("./config/corsOptions");
app.use(cors(corsOptions));

// Build-in middleware to handle urlencoded data
// in other words, form-data:
// Content-Type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// Build-in middleware for json
app.use(express.json());

// use cookie
app.use(cookies())

// Server static file
app.use("/", express.static(path.join(__dirname, "/public")));

// Routes
app.use("/", rootRouter);
app.use("/auth", authRouter);
app.use("/refresh-token", refreshTokenRouter);

app.use(verifyToken)
app.use("/employees", employeeRouter);

app.all("*", (req, res) => {
    if (req.accepts("html")) {
        res.sendFile(path.join(__dirname, "views", "404.html"));
    } else if (req.accepts("json")) {
        res.json({
            error: "404 Not Found",
        });
    } else {
        res.type("txt").send("404 Not Found");
    }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('connect to mongodb')
    app.listen(PORT, () => console.log(`server running on port: ${PORT}`));

})
