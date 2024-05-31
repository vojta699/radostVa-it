const recipeDao = require("../../../dao/recipe-dao.js");
const ratingDao = require("../../../dao/rating-dao.js");

async function ListSortByRatingAbl(req, res) {
    try {
        // Počkáme na získání seznamu receptů
        const recipeList = await recipeDao.list();
        // Získáme průměrné hodnocení ke každému receptu
        for (let i = 0; i < recipeList.length; i++) {
            let recipeID = recipeList[i].id
            const filteredObjects = ratingDao.list().filter((element) => element.recipe_ID === recipeID); // pole hodnocení s konkrétním id receptu
            let ratingSum = 0
            for (let i = 0; i < filteredObjects.length; i++) {
                ratingSum = ratingSum + filteredObjects[i].rating
            }
            let rating
            if (filteredObjects.length === 0){
                rating = 0
            } else {
                rating = ratingSum / filteredObjects.length // průměrné hodnocení
            }
            recipeList[i].avgRating = rating
        }
        // Seřadíme recepty podle průměrného hodnocení od nejvyšší hodnoty po nejmenší
        sortByPropertyValue(recipeList, "avgRating");

        // Odpověď s seřazeným seznamem receptů
        res.json(recipeList);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

// Řadící funkce
function sortByPropertyValue(array, property) {
  array.sort(function(a, b) {
      if (a[property] > b[property]) {
          return -1;
      }
      if (a[property] < b[property]) {
          return 1;
      }
      return 0;
  });
}

module.exports = ListSortByRatingAbl;