const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);


const ratingDao = require("../../dao/rating-dao.js");

const schema = {
  type: "object",
  properties: {
    rating: { enum: [1, 2, 3, 4, 5] },
    recipe_ID: { type: "string", minLength: 32, maxLength: 32 }
  },
  required: ["rating", "recipe_ID"],
  additionalProperties: false,
};

async function CreateAbl(req, res) {
  try {
    let rating = req.body;

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

    rating = ratingDao.create(rating);
    res.json(rating);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = CreateAbl;