"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Animal = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AnimalSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    gender: { type: String, enum: ["male", "female"], required: true },
    species: { type: String, required: true },
    age: { type: Number, required: true },
    health: { type: String, required: true },
    nature: { type: String, required: true },
    photos: { type: [String], default: [], required: false },
    isAdopted: { type: Boolean, required: true },
    post_ids: { type: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Post' }], required: false }
});
exports.Animal = mongoose_1.default.model('Animal', AnimalSchema);
