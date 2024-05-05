const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);


const recipeDao = require("../../dao/recipe-dao.js");
const { Country } = require("../../helpers/enumCountry.js");
const { Units } = require("../../helpers/enumUnit.js");

const additionalSchemaMaterials = {
  type: "array",
  items: {
    type: "object",
    properties: {
      name: { type: "string", minLength: 3, maxLength: 20 },
      value: { type: "number" },
      unit: { enum: Object.values(Units) }
    },
    required: ["name", "value", "unit"]
  },
};

const additionalSchemaMethod = {
  type: "array",
  items: {
    type: "object",
    properties: {
      steps: { type: "string", maxLength: 300 }
    },
    required: ["steps"]
  },
};

const schema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 3, maxLength: 20 },
    user_ID: { type: "string", minLength: 32, maxLength: 32 },
    countryOfOrigin: { enum: Object.values(Country) },
    portion: { enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    materials: additionalSchemaMaterials,
    method: additionalSchemaMethod,
    imgName: { type: "string", minLength: 36, maxLength: 36 }
  },
  required: ["name", "user_ID", "countryOfOrigin", "portion", "materials", "method"],
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

    // default image
    if (recipe.imgName === undefined) {
      recipe.imgName = "66dcf3ba9b55edc3abda45e142b02f46.png"
    }

    recipe = recipeDao.create(recipe);
    res.json(recipe);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = CreateAbl;
