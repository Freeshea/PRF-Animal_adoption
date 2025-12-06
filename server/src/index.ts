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
import client from "prom-client";


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

// Prometheus Metrics
// const collectDefaultMetrics = client.collectDefaultMetrics;
// collectDefaultMetrics();

// app.get("/metrics", async (req, res) => {
//   res.set('Content-Type', client.register.contentType);
//   res.end(await client.register.metrics());
// });

const register = new client.Registry();

// default Node.js metrics (CPU, mem, heap, event loop, GC, uptime…)
client.collectDefaultMetrics({ register });

// Request COUNTER
const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of requests handled",
  labelNames: ["method", "route", "status"],
});

// Request DURATION histogram
const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status"],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1], // suitable for REST APIs
});

// Error COUNTER
const httpErrorCounter = new client.Counter({
  name: "http_errors_total",
  help: "Number of error responses",
  labelNames: ["method", "route", "status"],
});

// REQUEST METRICS MIDDLEWARE
app.use((req, res, next) => {
  const route = (req as any).route?.path || req.originalUrl.split("?")[0] || "unknown";

  const method = req.method;

  const end = httpRequestDuration.startTimer();

  res.on("finish", () => {
    const status = res.statusCode.toString();

    // Count every request
    httpRequestCounter.labels(method, route, status).inc();

    // Count errors
    if (res.statusCode >= 400) {
      httpErrorCounter.labels(method, route, status).inc();
    }

    end({ method, route, status });
  });

  next();
});

// METRICS ENDPOINT
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});



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
