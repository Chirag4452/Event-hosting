import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    parentName: {
        type: String,
        required: true,
    },
    parentPhone: {
        type: String,
        required: true,
    },
    grade: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model("User", userSchema);

export default User;
