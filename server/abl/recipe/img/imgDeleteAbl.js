const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const imgDao = require("../../../dao/img-dao.js");

const schema = {
  type: "object",
  properties: {
    fileName: { type: "string", minLength: 36, maxLength: 37 },
  },
  required: ["fileName"],
  additionalProperties: false,
};

// smazání obrázku
async function ImgDeleteAbl(req, res) {
    try {
      const fileName = req.params.fileName

      // validate input
      const valid = ajv.validate(schema, {fileName});
      if (!valid) {
        res.status(400).json({
          code: "dtoInIsNotValid",
          message: "dtoIn is not valid",
          validationError: ajv.errors,
        });
        return;
      }
  
      imgDao.remove(fileName);
  
      res.json({});
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
  
  module.exports = ImgDeleteAbl;
  