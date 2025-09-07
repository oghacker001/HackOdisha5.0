import mongoose from "mongoose";
const UpdateSchema = new mongoose.Schema({
  text: { type: String, required: true },
  images: [{ type: String }],
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});
const Update = mongoose.model('Update', UpdateSchema);
export default Update;