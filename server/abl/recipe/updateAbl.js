const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const recipeDao = require("../../dao/recipe-dao.js");
const { Country } = require("../../helpers/enumCountry.js");
const { Units } = require("../../helpers/enumUnit.js");

const additionalSchemaMaterials = {
  type: "object",
  properties: {
      id: { type: "string", minLength: 32, maxLength: 32, readOnly: true },
      name: { type: "string", minLength: 3, maxLength: 20 },
      value: { type: "number" },
      unit: { enum: Object.values(Units) }
  },
};

const additionalSchemaMethod = {
  type: "object",
  properties: {
      steps: { type: "string", maxLength: 300 }
  },
};

const schema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 3, maxLength: 20 },
    countryOfOrigin: { enum: Object.values(Country) },
    portion: { enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    materials: additionalSchemaMaterials,
    method: additionalSchemaMethod
  },
  additionalProperties: false,
};

async function UpdateAbl(req, res) {
  try {
    const { id } = req.params
    let recipe = req.body;
    
    // validate input
    const valid = ajv.validate(schema, recipe);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }
    recipe.id = id
    const updatedrecipe = recipeDao.update(recipe);
    if (!updatedrecipe) {
      res.status(404).json({
        code: "recipeNotFound",
        message: `recipe ${recipe.id} not found`,
      });
      return;
    }

    res.json(updatedrecipe);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = UpdateAbl;
