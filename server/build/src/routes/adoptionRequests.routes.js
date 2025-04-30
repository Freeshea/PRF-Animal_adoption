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
const AdoptionRequest_1 = require("./../models/AdoptionRequest");
const express_1 = require("express");
const router = (0, express_1.Router)();
// // GET all adoption requests FOR TESTING
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
// GET ALL or just user, depends
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.isAuthenticated()) {
        res.status(401).json({ message: "Not authenticated" });
        return;
    }
    const user = req.user;
    try {
        let requests;
        if (user.role === "admin") {
            // admin = every request
            requests = yield AdoptionRequest_1.AdoptionRequest.find()
                .populate("animal_id")
                .populate("user_id");
        }
        else {
            // user = only own requests
            requests = yield AdoptionRequest_1.AdoptionRequest.find({ user_id: user._id })
                .populate("animal_id")
                .populate("user_id");
        }
        res.status(200).json(requests);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}));
// POST create a new adoption request
router.post("/adopt", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.isAuthenticated()) {
        res.status(401).json({ message: "Not authenticated" });
        return;
    }
    try {
        const newRequest = new AdoptionRequest_1.AdoptionRequest({
            user_id: req.user._id,
            animal_id: req.body.animalId,
            message: req.body.reason,
            meetingDate: req.body.visitDate,
        });
        yield newRequest.save();
        res.status(200).json({ message: "Adoption request submitted" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
}));
// PUT update an adoption request
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.isAuthenticated()) {
        res.status(401).json({ message: "Not authenticated" });
        return;
    }
    try {
        const { meetingDate, status, message } = req.body;
        const requestId = req.params.id;
        const user = req.user;
        const adoptionRequest = yield AdoptionRequest_1.AdoptionRequest.findById(requestId);
        if (!adoptionRequest) {
            res.status(404).json({ message: "Request not found" });
            return;
        }
        if (user.role === "admin" ||
            adoptionRequest.user_id.toString() === user._id.toString()) {
            if (meetingDate)
                adoptionRequest.meetingDate = meetingDate;
            if (message !== undefined)
                adoptionRequest.message = message;
            if (user.role === "admin" && status)
                adoptionRequest.status = status; // only admin
            yield adoptionRequest.save();
            res.status(200).json({ message: "Request updated successfully" });
        }
        else {
            res
                .status(403)
                .json({ message: "Not authorized to update this request" });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}));
// DELETE an adoption request
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.isAuthenticated()) {
        res.status(401).json({ message: "Not authenticated" });
        return;
    }
    try {
        const requestId = req.params.id;
        const user = req.user;
        const adoptionRequest = yield AdoptionRequest_1.AdoptionRequest.findById(requestId);
        if (!adoptionRequest) {
            res.status(404).json({ message: "Request not found" });
            return;
        }
        if (user.role === "admin" ||
            adoptionRequest.user_id.toString() === user._id.toString()) {
            yield AdoptionRequest_1.AdoptionRequest.findByIdAndDelete(requestId);
            res.status(200).json({ message: "Request deleted successfully" });
        }
        else {
            res
                .status(403)
                .json({ message: "Not authorized to delete this request" });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}));
exports.default = router;
