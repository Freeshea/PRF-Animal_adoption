import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from 'bcrypt';

const SALT_FACTOR = 10;

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: string;
    favourite_animals?: string[];
    adoption_requests?: string[];
    comparePassword: (candidatePassword: string, callback: (error: Error | null, isMatch: boolean)=> void)=> void;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, default: 'user'},
    favourite_animals: {type: [mongoose.Schema.Types.ObjectId], ref: 'Animal', default: [] },
    adoption_requests: {type: [mongoose.Schema.Types.ObjectId], ref: 'Adoption', default: []},
}, {timestamps: true});

// Bcrypt hook
UserSchema.pre<IUser>('save', function(next){
    const user = this;

    if (!user.isModified('password')) {
        return next();
    }
    // hash password
    bcrypt.genSalt(SALT_FACTOR, (error, salt)=>{
        if(error){
            return next(error);
        }
        bcrypt.hash(user.password, salt, (err, encrypted)=>{
            if(err){
                return next(err);
            }
            user.password = encrypted;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword: string, callback: (error: Error | null, isMatch: boolean)=> void): void{
    const user = this;
    bcrypt.compare(candidatePassword, user.password, (error, isMatch)=>{
        if(error){
            callback(error, false);
        }
        return callback(null, isMatch);
    });
}

export const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);