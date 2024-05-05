const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);


const ratingDao = require("../../dao/rating-dao.js");
const userDao = require("../../dao/user-dao.js");
// body
const schema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 32, maxLength: 32 },
    rating: { enum: [1, 2, 3, 4, 5] },
    recipe_ID: { type: "string", minLength: 32, maxLength: 32 },
    user_ID: { type: "string", minLength: 32, maxLength: 32 }
  },
  additionalProperties: false,
};
// params
const schema2 = {
  type: "object",
  properties: {
    ratingid: { type: "string", minLength: 32, maxLength: 32 },
    userid: { type: "string", minLength: 32, maxLength: 32 },
  },
  required: ["ratingid", "userid"],
  additionalProperties: false,
};

async function UpdateAbl(req, res) {
  try {
    const ratingId = req.params.ratingid
    let rating = req.body
    const ids = req.params
    
    // validate input body
    const valid = ajv.validate(schema, rating);
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

    // autorizace uživatele + existence hodnocení
    const validationOfRating = ratingDao.get(ids.ratingid)
    const validationOfUser = userDao.get(ids.userid)
    if (validationOfUser === null) {
      return res.status(400).json({ code: "login", message: "You have to log in" })
    } else if (validationOfRating === null) {
      return res.status(400).json({ code: "ratingNotFound", message: "Rating does not exist" })
    } else if (validationOfUser.id !== validationOfRating.user_ID && validationOfUser.role !== "admin") {
      return res.status(400).json({ code: "noPermission", message: "You dont have permission" })
    }

    // Kontrola, ID klíče nelze aktualizovat
    if (rating.id !== undefined || rating.recipe_ID !== undefined || rating.user_ID !== undefined) {
      res.status(400).json({
        code: "readOnlyFields",
        message: "Fields 'id', 'recipe_ID', and 'user_ID' cannot be updated",
      });
      return;
    }

    rating.id = ratingId
    const updatedrating = ratingDao.update(rating);

    res.json(updatedrating);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = UpdateAbl;
