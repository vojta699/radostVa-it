const recipeDao = require("../../../dao/recipe-dao.js");

async function ListSortByCountryAbl(req, res) {
  try {
    // Počkáme na získání seznamu receptů
    const recipeList = await recipeDao.list();
    
    // Seřadíme recepty podle země původu
    sortByPropertyValue(recipeList, "countryOfOrigin");

    // Odpověď s seřazeným seznamem receptů
    res.json(recipeList);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

// Řadící funkce
function sortByPropertyValue(array, property, locale) {
  array.sort(function(a, b) {
    return a[property].localeCompare(b[property], locale);
});
}

module.exports = ListSortByCountryAbl;