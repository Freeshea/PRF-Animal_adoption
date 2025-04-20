"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdoptionRequest = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AdoptionRequestSchema = new mongoose_1.default.Schema({
    animal_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Animal', required: true },
    user_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    message: { type: String, required: false },
    meetingDate: { type: Date, required: true },
}, { timestamps: true });
exports.AdoptionRequest = mongoose_1.default.model('AdoptionRequest', AdoptionRequestSchema);
