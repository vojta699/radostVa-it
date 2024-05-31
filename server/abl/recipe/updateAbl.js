const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const recipeDao = require("../../dao/recipe-dao.js");
const userDao = require("../../dao/user-dao.js");
const { Country } = require("../../helpers/enumCountry.js");
const { Units } = require("../../helpers/enumUnit.js");
// schema materials
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
// schema method
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
// body
const schema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 32, maxLength: 32 },
    name: { type: "string", minLength: 3, maxLength: 20 },
    user_ID: { type: "string", minLength: 32, maxLength: 32 },
    countryOfOrigin: { enum: Object.values(Country) },
    duration: { type: "number", minimum: 1, maximum: 300 },
    portion: { enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    materials: additionalSchemaMaterials,
    method: additionalSchemaMethod,
    imgName: { type: "string", minLength: 36, maxLength: 36 }
  },
  additionalProperties: false,
};
// params
const schema2 = {
  type: "object",
  properties: {
    recipeid: { type: "string", minLength: 32, maxLength: 32 },
    userid: { type: "string", minLength: 32, maxLength: 32 },
  },
  required: ["recipeid", "userid"],
  additionalProperties: false,
};

async function UpdateAbl(req, res) {
  try {
    const recipeId = req.params.recipeid
    let recipe = req.body;
    const ids = req.params

    // validate input body
    const valid = ajv.validate(schema, recipe);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // validate input params
    const valid2 = ajv.validate(schema2, ids);
    if (!valid2) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // autorizace uživatele + existence receptu
    const validationOfRecipe = recipeDao.get(ids.recipeid)
    const validationOfUser = userDao.get(ids.userid)
    if (validationOfUser === null) {
      return res.status(400).json({ code: "login", message: "You have to log in" })
    } else if (validationOfRecipe === null) {
      return res.status(400).json({ code: "recipeNotFound", message: "recipe does not exist" })
    } else if (validationOfUser.id !== validationOfRecipe.user_ID && validationOfUser.role !== "admin") {
      return res.status(400).json({ code: "noPermission", message: "You dont have permision" })
    }

    // Kontrola, ID klíče nelze aktualizovat
    if (recipe.id !== undefined || recipe.user_ID !== undefined) {
      res.status(400).json({
        code: "readOnlyFields",
        message: "Fields 'id' and 'user_ID' cannot be updated",
      });
      return;
    }

    recipe.id = recipeId
    const updatedrecipe = recipeDao.update(recipe);

    res.json(updatedrecipe);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = UpdateAbl;
