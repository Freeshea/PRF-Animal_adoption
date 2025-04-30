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
const auth_1 = require("../../middlewares/auth");
const Post_1 = require("./../models/Post");
const express_1 = require("express");
const router = (0, express_1.Router)();
// GET /posts lists all post
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield Post_1.Post.find().populate("animal_id");
        res.status(200).json(posts);
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
// GET post by ID
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield Post_1.Post.findById(req.params.id).populate("animal_id");
        if (!post) {
            res.status(404).send("Post not found");
            return;
        }
        res.status(200).json(post);
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
// POST create new post
router.post("/", auth_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, animal_id } = req.body;
        console.log("ANIMALID: ", animal_id, " ANIMALID TYPE", typeof animal_id);
        const newPost = new Post_1.Post({
            title,
            description,
            animal_id,
            release_date: new Date(),
        });
        const savedPost = yield newPost.save();
        res.status(201).json(savedPost);
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
// PUT /posts/:id - post update
router.put("/:id", auth_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, animal_id } = req.body;
        const updated = yield Post_1.Post.findByIdAndUpdate(req.params.id, { title, description, animal_id }, { new: true });
        res.status(200).json(updated);
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
// DELETE delete post by ID
router.delete("/:id", auth_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedPost = yield Post_1.Post.findByIdAndDelete(req.params.id);
        if (!deletedPost) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        res.status(200).json(deletedPost);
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
exports.default = router;
