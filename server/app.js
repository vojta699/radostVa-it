const express = require("express");
const cors = require("cors");
const app = express();
const port = 8000;

const recipeController = require("./controller/recipe");
const ratingController = require("./controller/rating");
const userController = require("./controller/user");

app.use(express.json()); // podpora pro application/json
app.use(express.urlencoded({ extended: true })); // podpora pro application/x-www-form-urlencoded

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/recipe", recipeController);
app.use("/rating", ratingController);
app.use("/user", userController);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
