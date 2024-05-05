const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const recipeDao = require("../../dao/recipe-dao.js");
const userDao = require("../../dao/user-dao.js");

const schema = {
  type: "object",
  properties: {
    recipeid: { type: "string", minLength: 32, maxLength: 32 },
    userid: { type: "string", minLength: 32, maxLength: 32 },
  },
  required: ["recipeid", "userid"],
  additionalProperties: false,
};

async function DeleteAbl(req, res) {
  try {
    const ids = req.params

    // validate input
    const valid = ajv.validate(schema, ids);
    if (!valid) {
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

    recipeDao.remove(ids.recipeid);

    res.json({});
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = DeleteAbl;