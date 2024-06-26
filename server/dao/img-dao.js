const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require('multer');

const imgFolderPath = path.join(__dirname, "storage", "imgList");

// Metoda na upload obrázku
// Název + úložišě obrázku
const storage = multer.diskStorage({
    destination: './dao/storage/imgList',
    filename: (req, file, cb) => {
      return cb(null, `${crypto.randomBytes(16).toString('hex')}${path.extname(file.originalname)}`);
    },
  });
  // Povolené formáty a limity
  const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        return cb(null, true)
      } else {
        cb(null, false)
        return cb(new Error("Only image formats allowed!"))
    }
     
    },
    limits: { fileSize: 2000000 }, // max 2MB
   }).single("file") // pouze jeden soubor, klíč musí být file
  
// Metoda na odstranění obrázku
function remove(fileName) {
  try {
    const filePath = path.join(imgFolderPath, fileName);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") {
      return {};
    }
    throw { code: "failedToRemoverecipe", message: error.message };
  }
}

// Metoda na získání obrázku
function get(fileName) {
  try {
    const filePath = path.join(imgFolderPath, fileName);
    const fileData = fs.readFileSync(filePath);
    return fileData;
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadrecipe", message: error.message };
  }
}
  
  module.exports = {
    upload,
    remove,
    get
  };