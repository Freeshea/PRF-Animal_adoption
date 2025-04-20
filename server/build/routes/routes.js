"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureRoutes = void 0;
const User_1 = require("../models/User");
const configureRoutes = (passport, router) => {
    router.get('/', (req, res) => {
        res.status(200).send("Default / page!");
    });
    // Login
    router.post('/login', (req, res, next) => {
        passport.authenticate('local', (error, user) => {
            if (error) {
                console.log("Login failed: ", error);
                return res.status(500).send({ error: "Internal server error" });
            }
            else {
                if (!user) {
                    return res.status(400).send({ error: "User not found." });
                }
                else {
                    req.login(user, (err) => {
                        if (err) {
                            console.log("Login session error: ", err);
                            return res.status(500).send({ error: "Internal server error" });
                        }
                        else {
                            return res.status(200).send({ message: "Logged in successfully " + user });
                        }
                    });
                }
            }
        })(req, res, next);
    });
    // Register
    router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, email, password, role } = req.body;
            // Double registration check
            const existingUser = yield User_1.User.findOne({ email });
            if (existingUser) {
                res.status(400).send("User with this email already exists.");
                return;
            }
            // New user
            const user = new User_1.User({
                name,
                email,
                password,
                role,
                favourite_animals: [],
                adoption_requests: [],
            });
            const savedUser = yield user.save();
            res.status(201).send(savedUser);
        }
        catch (error) {
            console.error("Registration error:", error);
            res.status(500).send("Error during registration.");
        }
    }));
    // Logout
    router.post('/logout', (req, res) => {
        if (req.isAuthenticated()) {
            req.logout((error) => {
                if (error) {
                    console.log("Something went wrong ", error);
                    return res.status(500).send(error);
                }
                return res.status(200).send("Successfully logged out.");
            });
        }
        else {
            res.status(500).send("User is not logged in.");
        }
    });
    // Check if authenticated
    router.get('/checkAuth', (req, res) => {
        if (req.isAuthenticated()) {
            res.status(200).send({ authenticated: true });
        }
        else {
            res.status(401).send({ authenticated: false });
        }
    });
    return router;
};
exports.configureRoutes = configureRoutes;
