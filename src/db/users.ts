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
//find one user by email
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
//find out if user is logged in or not
export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne({
    'authentication.sessionToken': sessionToken,
});
export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) => new UserModel(values)
    .save().then((user) => user.toObject());
export const deleteUserById = (id: string) => UserModel.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values);


