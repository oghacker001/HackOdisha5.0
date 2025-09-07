import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    role: { type: String, enum: ['user', 'organizer', 'admin'], required: true },
    email: { type: String, required: function () { return !this.googleId; }, unique: true, lowercase: true, sparse: true, index: true },
    password: { type: String, required: function () { return !this.googleId && this.role !== "admin"; } },
    googleId: { type: String, unique: true, sparse: true },
    displayName: { type: String, index: true },
    adminKey: { type: String },
    profilePhoto: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const userModel = mongoose.models.User || mongoose.model('User', UserSchema);
export default userModel;