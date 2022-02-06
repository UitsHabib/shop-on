const multer = require('multer');
const path = require('path');

const upload = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        if (!ext == 'png' && !ext == 'jpeg' && !ext == 'jpg') {
            cb(new Error('Only images are allowed!'), false);
            return;
        }
        cb(null, true);
    },
});

module.exports=upload;