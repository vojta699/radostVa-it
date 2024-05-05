const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const recipeDao = require("../../dao/recipe-dao.js");

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

    // Ověření zda recept existuje
    const recipe = recipeDao.get(id.id);
    if (!recipe) {
      res.status(404).json({
        code: "recipeNotFound",
        message: `recipe ${id.id} not found`,
      });
      return;
    }

    res.json(recipe);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = GetAbl;
