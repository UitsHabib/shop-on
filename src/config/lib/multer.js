const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join(process.cwd(), "public/uploads");

        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const limits = {
    fileSize: 2 * 1024 * 1024
}

const fileFilter = function (req, file, cb) {
    const fileTypes = ['image/png', 'image/jpg', 'image/jpeg'];

    if (fileTypes.includes(file.mimetype)) cb(null, true);
    else return cb(new Error('Only .png, .jpg and .jpeg format allowed!'), false);
}

module.exports = multer({ storage, limits, fileFilter });