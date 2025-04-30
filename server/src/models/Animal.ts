import mongoose, { Document, Model, Schema } from "mongoose";

interface IAnimal extends Document {
  name: string;
  gender: string;
  species: string;
  age: number;
  health: string;
  nature: string;
  photos?: string[]; // URLs
  isAdopted: boolean; // Availability: available: false | already adopted: true;
  post_ids?: string[];
}

const AnimalSchema: Schema<IAnimal> = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, enum: ["male", "female"], required: true },
  species: { type: String, required: true },
  age: { type: Number, required: true },
  health: { type: String, required: true },
  nature: { type: String, required: true },
  photos: { type: [String], default: [], required: false },
  isAdopted: { type: Boolean, required: true },
  post_ids: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    required: false,
  },
});

export const Animal: Model<IAnimal> = mongoose.model<IAnimal>(
  "Animal",
  AnimalSchema
);
