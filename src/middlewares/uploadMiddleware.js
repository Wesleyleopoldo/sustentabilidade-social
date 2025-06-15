const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.resolve(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
    destination: (request, file, callback) => callback(null, uploadDir),
    filename: (request, file, callback) => {
        const extension = path.extname(file.originalname);
        const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
        callback(null, filename);
    }
});

const upload = multer({ storage });
console.log("Middleware executado corretamente");
module.exports = upload;