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
    const { id } = req.params
    const recipe = recipeDao.get(id);
    
    if (!recipe) {
      res.status(404).json({
        code: "recipeNotFound",
        message: `recipe ${id} not found`,
      });
      return;
    }

    res.json(recipe);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = GetAbl;
