import multer from "multer";

const storage=multer.memoryStorage();

export const upload=multer({
    storage,
    limits:{fileSize:5*1024*1024},
    fileFilter:(req,file,cb)=>{
        const allowedTypes= /jpeg|jpg|png/;
        const extname = allowedTypes.test(file.originalname.toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) cb(null, true);
        else cb('Error: Only images are allowed');
    }
})