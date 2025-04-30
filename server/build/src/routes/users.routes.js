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
const express_1 = require("express");
const User_1 = require("../models/User");
const AdoptionRequest_1 = require("../models/AdoptionRequest");
const router = (0, express_1.Router)();
exports.default = (passport) => {
    // GET all users
    router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = yield User_1.User.find();
            res.status(200).json(users);
            return;
        }
        catch (err) {
            res.status(500).send(err);
            return;
        }
    }));
    // GET user by ID
    router.get("/profile", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuthenticated() || !req.user) {
            res.status(401).json({ message: "User not authenticated" });
            return;
        }
        try {
            const user = yield User_1.User.findById(req.user._id).select("name email role favourite_animals adoption_requests");
            res.status(200).json(user);
            return;
        }
        catch (err) {
            res.status(500).json({ message: "Error fetching user profile" });
            return;
        }
    }));
    // POST Login
    router.post("/login", (req, res, next) => {
        passport.authenticate("local", (error, user) => {
            if (error) {
                console.log(error);
                res.status(500).send(error);
            }
            else {
                if (!user) {
                    res.status(400).send("User not found.");
                }
                else {
                    req.login(user, (err) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send("Internal server error.");
                        }
                        else {
                            res.status(200).send(user);
                        }
                    });
                }
            }
        })(req, res, next);
    });
    // POST Register
    router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, email, password } = req.body;
            // Double registration check
            const existingUser = yield User_1.User.findOne({ email });
            if (existingUser) {
                console.log("User already exist.");
                res.status(400).send("User with this email already exists.");
                return;
            }
            // New user
            const user = new User_1.User({
                name,
                email,
                password,
                role: email === "admin@admin.com" ? "admin" : "user",
            });
            const savedUser = yield user.save();
            res.status(201).send(savedUser);
            return;
        }
        catch (error) {
            console.error("Registration error:", error);
            res.status(500).send("Error during registration.");
            return;
        }
    }));
    // POST Logout
    router.post("/logout", (req, res) => {
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
            return;
        }
    });
    // GET Check if authenticated
    router.get("/checkAuth", (req, res) => {
        if (req.isAuthenticated()) {
            res.status(200).send({ authenticated: true });
            return;
        }
        else {
            res.status(401).send("User is not logged in");
            return;
        }
    });
    // PUT Update user account
    router.put("/profile", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuthenticated()) {
            res.status(401).json({ message: "Not authenticated" });
            return;
        }
        try {
            const userId = req.user._id;
            const { name } = req.body;
            const updatedUser = yield User_1.User.findByIdAndUpdate(userId, { name }, { new: true });
            if (!updatedUser) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            res.status(200).json(updatedUser);
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: "Failed to update profile" });
        }
    }));
    // DELETE user account
    router.delete("/delete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuthenticated() || !req.user) {
            res.status(401).json({ message: "User not authenticated" });
            return;
        }
        try {
            const userId = req.user._id;
            const user = yield User_1.User.findByIdAndDelete(userId);
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            // Delete from AdoptionRequest that the user created.
            yield AdoptionRequest_1.AdoptionRequest.deleteMany({ user_id: userId });
            res.status(200).json({ message: "Account deleted successfully" });
            return;
        }
        catch (err) {
            res.status(500).json({ message: "Error deleting account" });
            return;
        }
    }));
    // DELETE ALL USERS (for debugging) -- FOR TESTING: POSTMAN DELETE http://localhost:5000/app/users/delete-all
    // router.delete('/delete-all', async (req: Request, res: Response) => {
    //   try {
    //     await User.deleteMany({});
    //     res.status(200).json({ message: 'All users deleted.' });
    //     return;
    //   } catch (err) {
    //     res.status(500).json({ error: 'Failed to delete users.' });
    //     return;
    //   }
    // });
    // Add to favourites
    router.post("/favourite", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuthenticated()) {
            res.status(401).json({ message: "User not authenticated" });
            return;
        }
        try {
            const user = yield User_1.User.findById(req.user._id);
            if (!user.favourite_animals.includes(req.body.petId)) {
                user.favourite_animals.push(req.body.petId);
                yield user.save();
            }
            res.status(200).json({ message: "Added to favourites" });
            return;
        }
        catch (err) {
            res.status(500).json({ message: "Error adding to favourites" });
            return;
        }
    }));
    // Delete from favourites
    router.post("/unfavourite", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuthenticated()) {
            res.status(401).json({ message: "User not authenticated" });
            return;
        }
        try {
            const user = yield User_1.User.findById(req.user._id);
            user.favourite_animals = user.favourite_animals.filter((id) => id.toString() !== req.body.petId.toString());
            yield user.save();
            res.status(200).json({ message: "Removed from favourites" });
            return;
        }
        catch (err) {
            res.status(500).json({ message: "Error removing from favourites" });
            return;
        }
    }));
    return router;
};
