import mongoose, { Document, Model, Schema } from "mongoose";

interface IPost extends Document{
    title: string;
    description: string;
    animal_id: mongoose.Types.ObjectId; // Of which animal is the post about
    release_date: Date;
}

const PostSchema: Schema<IPost> = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    animal_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true},
    release_date: {type: Date, default: Date.now},
});

export const Post: Model<IPost> = mongoose.model<IPost>('Post', PostSchema);