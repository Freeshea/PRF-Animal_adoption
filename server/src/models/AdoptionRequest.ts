import mongoose, { Document, Model, Schema } from "mongoose";

interface IAdoptionRequest extends Document {
    animal_id: mongoose.Types.ObjectId; // Which animal is requested
    user_id: mongoose.Types.ObjectId; // Who wants to adopt the animal
    status: 'pending' | 'accepted' | 'rejected';
    message?: string;
    meetingDate: Date;
}

const AdoptionRequestSchema: Schema<IAdoptionRequest> = new mongoose.Schema({
    animal_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true},
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    status: {type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending'},
    message: {type: String},
    meetingDate: {type: Date, required: true},
}, {timestamps: true});

export const AdoptionRequest: Model<IAdoptionRequest> = mongoose.model<IAdoptionRequest>('AdoptionRequest', AdoptionRequestSchema);