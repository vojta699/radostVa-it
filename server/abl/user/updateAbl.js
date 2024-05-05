const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const userDao = require("../../dao/user-dao.js");
// body
const schema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 3, maxLength: 20 },
    email: { type: "string", format: "email" },
  },
  additionalProperties: false,
};
// params
const schema2 = {
  type: "object",
  properties: {
    loggeduserid: { type: "string", minLength: 32, maxLength: 32 },
    edituserid: { type: "string", minLength: 32, maxLength: 32 },
  },
  required: ["loggeduserid", "edituserid"],
  additionalProperties: false,
};

async function UpdateAbl(req, res) {
  try {
    const { edituserid } = req.params
    let user = req.body;
    const ids = req.params

    // validate input body
    const valid = ajv.validate(schema, user);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // validate input input params
    const valid2 = ajv.validate(schema2, ids);
    if (!valid2) {
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
    if (validationOfloggedUserId === null) {
      return res.status(400).json({ code: "login", message: "You have to log in" })
    } else if (validationOfUserInDatabase === null) {
      return res.status(400).json({ code: "userNotFound", message: "User does not exist" })
    } else if (validationOfUserInDatabase.id !== validationOfloggedUserId.id && validationOfloggedUserId.role !== "admin") {
      return res.status(400).json({ code: "noPermission", message: "You dont have permision" })
    }

    // kontrola zda uživatel s daným emailem již existuje
    user.id = edituserid
    const userList = userDao.list();
    const emailExists = userList.some((u) => u.email === user.email && u.id !== user.id);
    if (emailExists) {
      res.status(400).json({
        code: "emailAlreadyExists",
        message: `User with email ${user.email} already exists`,
      });
      return;
    }

    const updatedUser = userDao.update(user);

    res.json(updatedUser);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = UpdateAbl;
