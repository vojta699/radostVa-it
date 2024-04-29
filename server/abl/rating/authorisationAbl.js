const userDao = require("../../dao/user-dao.js");
const ratingDao = require("../../dao/rating-dao.js");

// Autorizace uživatele
function AuthUserAbl (req, res, next) {
    const userId = req.params.userid
    const ratingId = req.params.ratingid
    const validationOfRating = ratingDao.get(ratingId)
    const validationOfUser = userDao.get(userId)
    if (validationOfUser === null){
        return  res.status(400).json({ message: "You have to log in" })
    }   else if (validationOfRating === null){
        return  res.status(400).json({ message: "Rating does not exist" })
    }   else if (validationOfUser.id !== validationOfRating.user_ID && validationOfUser.role !== "admin"){
        return  res.status(400).json({ message: "You dont have permision" })
    }
    next()
}

module.exports = AuthUserAbl
