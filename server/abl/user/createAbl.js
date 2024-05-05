const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const { Roles } = require("../../helpers/enumRoles.js");

const userDao = require("../../dao/user-dao.js");

const schema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 3, maxLength: 20 },
    email: { type: "string", format: "email" },
    role: { enum: Object.values(Roles) }
  },
  required: ["name", "email", "role"],
  additionalProperties: false,
};

async function CreateAbl(req, res) {
  try {
    let user = req.body;

    // validate input
    const valid = ajv.validate(schema, user);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }
    
    // kontrola zda uživatel s daným emailem již existuje
    const userList = userDao.list();
    const emailExists = userList.some((u) => u.email === user.email);
    if (emailExists) {
      res.status(400).json({
        code: "emailAlreadyExists",
        message: `User with email ${user.email} already exists`,
      });
      return;
    }

    user = userDao.create(user);
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = CreateAbl;
