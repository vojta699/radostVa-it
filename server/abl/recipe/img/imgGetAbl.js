const imgDao = require("../../../dao/img-dao.js");

async function ImgGetAbl(req, res) {
    try {
      const { fileName } = req.params
      const img = Buffer.from(imgDao.get(fileName)) 
      res.send(img.toString("base64"));
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

module.exports = ImgGetAbl;