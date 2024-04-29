const ratingDao = require("../../dao/rating-dao.js")

// průměrné hodnocení konkrétního receptu

async function AvgRatingAbl(req, res) {
  try {
    const recipeId = req.params.recipeid // id receptu
    const filteredObjects = ratingDao.list().filter((element) => element.recipe_ID === recipeId); // pole hodnocení s konkrétním id receptu
    let ratingSum = 0
    for(let i = 0; i < filteredObjects.length; i++){
        ratingSum = ratingSum + filteredObjects[i].rating
    }

    const rating = ratingSum / filteredObjects.length // průměrné hodnocení

    res.json(rating);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = AvgRatingAbl;
