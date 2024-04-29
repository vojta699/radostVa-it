const recipeDao = require("../../dao/recipe-dao.js");
const userDao = require("../../dao/user-dao.js");

// Autorizace uživatele
function AuthUserAbl (req, res, next) {
    const userId = req.params.userid
    const recipeId = req.params.recipeid
    const validationOfRecipe = recipeDao.get(recipeId)
    const validationOfUser = userDao.get(userId)
    if (validationOfUser === null){
        return  res.status(400).json({ message: "You have to log in" })
    }   else if (validationOfRecipe === null){
        return  res.status(400).json({ message: "Recipe does not exist" })
    }   else if (validationOfUser.id !== validationOfRecipe.user_ID && validationOfUser.role !== "admin"){
        return  res.status(400).json({ message: "You dont have permision" })
    }
    next()
}


module.exports = AuthUserAbl
