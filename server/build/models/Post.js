"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const PostSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    animal_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Animal', required: true },
    release_date: { type: Date, default: Date.now },
});
exports.Post = mongoose_1.default.model('Post', PostSchema);
