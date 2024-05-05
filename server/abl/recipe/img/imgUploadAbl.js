const multer = require('multer');

const imgDao = require("../../../dao/img-dao.js");

// Validace uploadu
async function UploadAbl(req, res) {
  imgDao.upload(req, res, function(err) {
    if (err instanceof multer.MulterError){
      res.send(err)
    } else if (err){
      res.status(400).json({
        code: "imageFormatOnly",
        message: "Only image formats allowed!",
      });
    }
    res.status(200).json(req.file);
})
}

module.exports = UploadAbl;