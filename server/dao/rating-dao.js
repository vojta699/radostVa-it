const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ratingFolderPath = path.join(__dirname, "storage", "ratingList");

// Method to write an rating to a file
function get(ratingId) {
  try {
    const filePath = path.join(ratingFolderPath, `${ratingId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadrating", message: error.message };
  }
}

function create(rating) {
  try {
    rating.id = crypto.randomBytes(16).toString("hex");
    const filePath = path.join(ratingFolderPath, `${rating.id}.json`);
    const fileData = JSON.stringify(rating);
    fs.writeFileSync(filePath, fileData, "utf8");
    return rating;
  } catch (error) {
    throw { code: "failedToCreaterating", message: error.message };
  }
}

// Method to update rating in a file
function update(rating) {
  try {
    const currentrating = get(rating.id);
    if (!currentrating) return null;
    const newrating = { ...currentrating, ...rating };
    const filePath = path.join(ratingFolderPath, `${rating.id}.json`);
    const fileData = JSON.stringify(newrating);
    fs.writeFileSync(filePath, fileData, "utf8");
    return newrating;
  } catch (error) {
    throw { code: "failedToUpdaterating", message: error.message };
  }
}

// Method to list ratings in a folder
function list() {
  try {
    const files = fs.readdirSync(ratingFolderPath);
    const ratingList = files.map((file) => {
      const fileData = fs.readFileSync(path.join(ratingFolderPath, file), "utf8");
      return JSON.parse(fileData);
    });
    return ratingList;
  } catch (error) {
    throw { code: "failedToListratings", message: error.message };
  }
}


module.exports = {
  create,
  list,
  update
};
