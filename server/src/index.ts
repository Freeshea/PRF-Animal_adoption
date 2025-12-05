import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import { configurePassport } from "./passport/passport";
import usersRoutes from "./routes/users.routes";
import animalsRoutes from "./routes/animals.routes";
import postsRoutes from "./routes/posts.routes";
import adoptionRequestsRoutes from "./routes/adoptionRequests.routes";

const app = express();
const PORT = 5000;
//const dbUrl = "mongodb://localhost:6000/animals_db";
const dbUrl = "mongodb://mongo:27017/animals_db";


// POST/PUT JSON
app.use(express.json());

// MongoDB connection
mongoose
  .connect(dbUrl)
  .then((_) => {
    console.log("Succesfully connected to MongoDB: ", mongoose.connection.name);
  })
  .catch((error) => {
    console.log("Error occured: " + error);
    return;
  });

// Cors
const whitelist = ["*", "http://localhost:4200"];
const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allowed?: boolean) => void
  ) => {
    if (whitelist.indexOf(origin!) !== -1 || whitelist.includes("*")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS."));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

// bodyParser
app.use(bodyParser.urlencoded({ extended: true }));

// cookieParser
app.use(cookieParser());

// Session
const sessionOptions: session.SessionOptions = {
  secret: "secret-sess-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    sameSite: "lax",
  },
};
app.use(session(sessionOptions));

// Passport
app.use(passport.initialize());
app.use(passport.session());

configurePassport(passport);

// usersRoutes
app.use("/app/users", usersRoutes(passport));

// animalsRoutes
app.use("/app/animals", animalsRoutes);

// postsRoutes
app.use("/app/posts", postsRoutes);

// adoptionRequestRoutes
app.use("/app/adoptionRequests", adoptionRequestsRoutes);

// Server listening
app.listen(PORT, () => {
  console.log("Server running on http://localhost:5000");
});
