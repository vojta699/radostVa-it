const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const userDao = require("../../dao/user-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 32, maxLength: 32 },
  },
  required: ["id"],
  additionalProperties: false,
};

async function GetAbl(req, res) {
  try {
    const id = req.params
    
    // validate input
    const valid = ajv.validate(schema, id);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // Ověření zda uživatel existuje
    const user = userDao.get(id.id);
    if (!user) {
      res.status(404).json({
        code: "userNotFound",
        message: `User ${id.id} not found`,
      });
      return;
    }

    res.json(user);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = GetAbl;
