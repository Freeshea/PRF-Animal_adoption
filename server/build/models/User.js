"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const SALT_FACTOR = 11;
const UserSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    favourite_animals: { type: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Animal' }], required: false },
    adoption_requests: { type: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Adoption_req' }], required: false },
}, { timestamps: true });
// Bcrypt hook
UserSchema.pre('save', function (next) {
    const user = this;
    // hash password
    bcrypt_1.default.genSalt(SALT_FACTOR, (error, salt) => {
        if (error) {
            return next(error);
        }
        bcrypt_1.default.hash(user.password, salt, (err, encrypted) => {
            if (err) {
                return next(err);
            }
            user.password = encrypted;
            next();
        });
    });
});
UserSchema.methods.comparePassword = function (candidatePassword, callback) {
    const user = this;
    bcrypt_1.default.compare(candidatePassword, user.password, (error, isMatch) => {
        if (error) {
            callback(error, false);
        }
        return callback(null, isMatch);
    });
};
exports.User = mongoose_1.default.model('User', UserSchema);
