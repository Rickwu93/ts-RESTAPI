import mongoose from "mongoose";
//basic user schema 
const UserSchema = new mongoose.Schema({
    username: { type: String, require: true },
    email: { type: String, required: true },
    authentication: {
        password: { type: String, required: true, select: false },
        salt: { type: String, select: false },
        sessionToken: { type: String, select: false },
    }
});
//creating a user model from the schema
export const UserModel = mongoose.model('User', UserSchema);
//find users 
export const getUsers = () => UserModel.find();


