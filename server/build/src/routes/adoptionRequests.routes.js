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
const AdoptionRequest_1 = require("./../models/AdoptionRequest");
const express_1 = require("express");
const router = (0, express_1.Router)();
// // GET all adoption requests
// router.get("/", async (req: Request, res: Response) => {
//   try {
//     const requests = await AdoptionRequest.find()
//       .populate("animal_id")
//       .populate("user_id");
//     res.status(200).json(requests);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });
// // GET adoption request by ID
// router.get("/:id", async (req: Request, res: Response) => {
//   try {
//     const request = await AdoptionRequest.findById(req.params.id)
//       .populate("animal_id")
//       .populate("user_id");
//     if (!request) {
//       res.status(404).send("Adoption request not found");
//       return;
//     }
//     res.status(200).json(request);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });
// GET ALL or just user, depends
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.isAuthenticated()) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
    }
    const user = req.user;
    try {
        let requests;
        if (user.role === 'admin') {
            // admin = minden request
            requests = yield AdoptionRequest_1.AdoptionRequest.find()
                .populate('animal_id')
                .populate('user_id');
        }
        else {
            // user = csak a saját request-jei
            requests = yield AdoptionRequest_1.AdoptionRequest.find({ user_id: user._id })
                .populate('animal_id')
                .populate('user_id');
        }
        res.status(200).json(requests);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}));
// POST create a new adoption request
router.post('/adopt', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.isAuthenticated()) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
    }
    try {
        const newRequest = new AdoptionRequest_1.AdoptionRequest({
            user_id: req.user._id,
            animal_id: req.body.animalId,
            message: req.body.reason,
            meetingDate: req.body.visitDate
        });
        yield newRequest.save();
        res.status(200).json({ message: 'Adoption request submitted' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
}));
// PUT update adoption request status (admin)
router.put("/:id/status", auth_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.body;
        if (!["pending", "accepted", "rejected"].includes(status)) {
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
