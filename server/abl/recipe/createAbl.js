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
      name: { type: "string", minLength: 3, maxLength: 20 },
      value: { type: "number" },
      unit: { enum: Object.values(Units) }
  },
  required: ["name", "value", "unit"]
};

const additionalSchemaMethod = {
  type: "object",
  properties: {
      steps: { type: "string", maxLength: 300 }
  },
  required: ["steps"]
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
  required: ["name", "countryOfOrigin", "portion", "materials", "method"],
  additionalProperties: false,
};

async function CreateAbl(req, res) {
  try {
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

    recipe = recipeDao.create(recipe);
    res.json(recipe);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = CreateAbl;
