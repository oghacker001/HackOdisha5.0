import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import 'dotenv/config';

// Storage configuration using GridFS
const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    file: (req, file) => ({ filename: `${Date.now()}-${file.originalname}`, bucketName: "uploads" }),
});

// File filter (only images)
const fileFilter = (req, file, cb) => {
    // For a hackathon, we can allow all file types for documents
    cb(null, true);
};

export const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for documents
    fileFilter,
});
