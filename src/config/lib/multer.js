const multer = require('multer');
const path = require('path');

module.exports = multer({
    storage: multer.diskStorage({}),
    limits: {
        fileSize: 2 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);

        if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            cb(new Error('Only images are allowed!'), false);
            return;
        }
        
        cb(null, true);
    },
});