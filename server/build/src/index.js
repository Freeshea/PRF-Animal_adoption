"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const passport_2 = require("./passport/passport");
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const animals_routes_1 = __importDefault(require("./routes/animals.routes"));
const posts_routes_1 = __importDefault(require("./routes/posts.routes"));
const adoptionRequests_routes_1 = __importDefault(require("./routes/adoptionRequests.routes"));
const app = (0, express_1.default)();
const PORT = 5000;
const dbUrl = "mongodb://localhost:6000/animals_db";
// POST/PUT JSON
app.use(express_1.default.json());
// MongoDB connection
mongoose_1.default
    .connect(dbUrl)
    .then((_) => {
    console.log("Succesfully connected to MongoDB: ", mongoose_1.default.connection.name);
})
    .catch((error) => {
    console.log("Error occured: " + error);
    return;
});
// Cors
const whitelist = ["*", "http://localhost:4200"];
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || whitelist.includes("*")) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS."));
        }
    },
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
// bodyParser
app.use(body_parser_1.default.urlencoded({ extended: true }));
// cookieParser
app.use((0, cookie_parser_1.default)());
// Session
const sessionOptions = {
    secret: "secret-sess-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        sameSite: "lax",
    },
};
app.use((0, express_session_1.default)(sessionOptions));
// Passport
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
(0, passport_2.configurePassport)(passport_1.default);
// usersRoutes
app.use("/app/users", (0, users_routes_1.default)(passport_1.default));
// animalsRoutes
app.use("/app/animals", animals_routes_1.default);
// postsRoutes
app.use("/app/posts", posts_routes_1.default);
// adoptionRequestRoutes
app.use("/app/adoptionRequests", adoptionRequests_routes_1.default);
// Server listening
app.listen(PORT, () => {
    console.log("Server running on http://localhost:5000");
});
