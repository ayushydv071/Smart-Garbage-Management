const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const dir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(dir, { recursive: true });

const EXT = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dir),
  filename: (req, file, cb) => {
    const name = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${EXT[file.mimetype]}`;
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  if (EXT[file.mimetype]) return cb(null, true);
  cb(new Error('Only JPG, PNG or WEBP images are allowed'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } });

exports.uploadPhoto = (req, res, next) => {
  upload.single('photo')(req, res, (err) => {
    if (err) {
      const message = err.code === 'LIMIT_FILE_SIZE' ? 'Photo must be under 2 MB' : err.message;
      return res.status(400).json({ message });
    }
    next();
  });
};
