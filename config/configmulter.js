const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const uploadPath = path.join(__dirname, '..', 'public', 'images', 'uploads');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}
//disk storage configuration for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(12, (err, bytes) => {
        if (err) {
            return cb(err);
        }
        const fn = bytes.toString('hex') + path.extname(file.originalname);
        cb(null, fn);
    })
}
});
//export multer variable
const upload = multer({ storage: storage });

module.exports = upload;