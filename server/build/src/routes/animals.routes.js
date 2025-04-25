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
const Animal_1 = require("../models/Animal");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
// GET /animals lists every animal
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const animals = yield Animal_1.Animal.find();
        res.status(200).json(animals);
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
// GET /animals:id list an animal by ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const animal = yield Animal_1.Animal.findById(req.params.id);
        if (!animal) {
            res.status(404).send("Animal is not found");
            return;
        }
        res.status(200).json(animal);
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
// POST /animals - creating new animal
router.post('/', auth_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newAnimal = new Animal_1.Animal(req.body);
        const savedAnimal = yield newAnimal.save();
        res.status(201).json(savedAnimal);
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
// PUT /animals/:id - animal update
router.put('/:id', auth_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("REQ PARAM ID",req.params.id);
    // console.log("REQ BODY",req.body);
    try {
        const updated = yield Animal_1.Animal.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updated);
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
// DELETE /animals/:id - animal delete
router.delete('/:id', auth_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Animal_1.Animal.findByIdAndDelete(req.params.id);
        res.status(204).send();
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
exports.default = router;
