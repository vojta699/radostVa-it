const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);


const ratingDao = require("../../dao/rating-dao.js");

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

async function UpdateAbl(req, res) {
  try {
    const { id } = req.params
    let rating = req.body

    // Kontrola, ID klíče nelze aktualizovat
    if (rating.id !== undefined || rating.recipe_ID !== undefined || rating.user_ID !== undefined) {
      res.status(400).json({
        code: "readOnlyFields",
        message: "Fields 'id', 'recipe_ID', and 'user_ID' cannot be updated",
      });
      return;
    }

    // validate input
    const valid = ajv.validate(schema, rating);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    rating.id = id
    const updatedrating = ratingDao.update(rating);
    if (!updatedrating) {
      res.status(404).json({
        code: "ratingNotFound",
        message: `rating ${rating.id} not found`,
      });
      return;
    }

    res.json(updatedrating);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = UpdateAbl;
