const multer = require("multer");

function validateFile(upload) {
    return function (req, res, next) {
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) return res.status(400).send(err);
            else if (err) return res.status(400).send(err);

            next();
        });
    }
}

module.exports = validateFile;