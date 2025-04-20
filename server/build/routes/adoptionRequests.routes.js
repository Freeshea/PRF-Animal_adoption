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
const Animal_1 = require("../models/Animal");
const User_1 = require("../models/User");
const AdoptionRequest_1 = require("./../models/AdoptionRequest");
const express_1 = require("express");
const router = (0, express_1.Router)();
// GET all adoption requests
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requests = yield AdoptionRequest_1.AdoptionRequest.find()
            .populate('animal_id')
            .populate('user_id');
        res.status(200).json(requests);
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
// GET adoption request by ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = yield AdoptionRequest_1.AdoptionRequest.findById(req.params.id)
            .populate('animal_id')
            .populate('user_id');
        if (!request) {
            res.status(404).send("Adoption request not found");
            return;
        }
        res.status(200).json(request);
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
// POST create a new adoption request
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { animal_id, user_id, message, meetingDate } = req.body;
        // Check if animal and user exists
        const animal = yield Animal_1.Animal.findById(animal_id);
        const user = yield User_1.User.findById(user_id);
        if (!animal || !user) {
            res.status(400).send("Invalid animal or user ID");
            return;
        }
        const newRequest = new AdoptionRequest_1.AdoptionRequest({
            animal_id,
            user_id,
            message,
            meetingDate
        });
        const savedRequest = yield newRequest.save();
        res.status(201).json(savedRequest);
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
// PUT update adoption request status (admin)  TODO : role check 
router.put('/:id/status', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.body;
        if (!['pending', 'accepted', 'rejected'].includes(status)) {
            res.status(400).send("Invalid status value.");
            return;
        }
        const updated = yield AdoptionRequest_1.AdoptionRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!updated) {
            res.status(404).send("Adoption request not found");
            return;
        }
        res.status(200).json(updated);
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
exports.default = router;
