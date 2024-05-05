const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const userDao = require("../../dao/user-dao.js");

const schema = {
  type: "object",
  properties: {
    loggeduserid: { type: "string", minLength: 32, maxLength: 32 },
    edituserid: { type: "string", minLength: 32, maxLength: 32 },
  },
  required: ["loggeduserid", "edituserid"],
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

    // autorizace uživatele + existence uživatele
    const validationOfloggedUserId = userDao.get(ids.loggeduserid)
    const validationOfUserInDatabase = userDao.get(ids.edituserid)
    if (validationOfloggedUserId === null){
      return  res.status(400).json({ code: "login", message: "You have to log in" })
  }   else if (validationOfUserInDatabase === null){
      return  res.status(400).json({ code: "userNotFound", message: "User does not exist" })
  }   else if (validationOfUserInDatabase.id !== validationOfloggedUserId.id && validationOfloggedUserId.role !== "admin"){
      return  res.status(400).json({ code: "noPermission", message: "You dont have permision" })
  }

    userDao.remove(ids.edituserid);

    res.json({});
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = DeleteAbl;
