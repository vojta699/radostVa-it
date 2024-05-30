import Button from "react-bootstrap/esm/Button.js";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { RecipeListContext } from "./RecipeListContext.js";
import { UserContext } from "./UserContext.js";

import RecipeDetail from "./RecipeDetail";
import RatingComponent from "./RatingComponent"

import Icon from "@mdi/react";
import { mdiDelete, mdiEyeOutline, mdiPencil } from "@mdi/js";

function RecipeCard({ recipe, setShowRecipeForm }) {
  const { loggedInUser } = useContext(UserContext);
  const { handlerMap } = useContext(RecipeListContext);

  const navigate = useNavigate();


  // smazat recept
  async function deleteRecipe() {
    try {
      await handlerMap.handleDelete(recipe.id, loggedInUser.id);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="card border-0 shadow rounded" style={componentStyle()}>

      <RecipeDetail recipe={recipe} />
      <RatingComponent recipeId={recipe.id} />
      {recipe.countryOfOrigin}
      <div
        style={{
          display: "flex",
          justifyContent: "right",
        }}
      >
        <div style={buttonsDivStyle()}>
          <Button style={buttonsStyle()} onClick={() => navigate("/recipeDetail?id=" + recipe.id)} size={"sm"}>
            <Icon path={mdiEyeOutline} size={0.7} />
          </Button>
          {loggedInUser && (loggedInUser.id === recipe.user_ID || loggedInUser.role === "admin") ? (
            <div>
              <Button style={buttonsStyle()} onClick={() => setShowRecipeForm(recipe)} size={"sm"}>
                <Icon path={mdiPencil} size={0.7} />
              </Button>
              <Button style={buttonsStyle()} onClick={() => deleteRecipe()} size={"sm"}>
                <Icon path={mdiDelete} size={0.7} />
              </Button>
            </div>
          ) : null}
        </div>
      </div>




    </div>
  );
}

function componentStyle() {
  return {
    maxWidth: "300px",
    margin: "12px",
    padding: "8px",
    display: "flex",
    flexDirection: "column",
  };
}

function buttonsDivStyle() {
  return {
    margin: "12px",
    padding: "8px",
    display: "flex",
    flexdirection: "column"
  }
}

function buttonsStyle() {
  return {
    marginRight: "5px",
  }
}

export default RecipeCard;
