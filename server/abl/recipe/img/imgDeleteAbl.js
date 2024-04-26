
const imgDao = require("../../../dao/img-dao.js");

async function ImgDeleteAbl(req, res) {
    try {
      const { fileName } = req.params
  
      imgDao.remove(fileName);
  
      res.json({});
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
  
  module.exports = ImgDeleteAbl;
  