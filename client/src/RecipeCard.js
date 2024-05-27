import Button from "react-bootstrap/esm/Button.js";
import { useNavigate } from "react-router-dom";

import RecipeDetail from "./RecipeDetail";

import Icon from "@mdi/react";
import { mdiDelete, mdiEyeOutline, mdiPencil } from "@mdi/js";

function RecipeCard({ recipe, setShowRecipeForm }) {
  const navigate = useNavigate();

  return (
    <div className="card border-0 shadow rounded" style={componentStyle()}>
      <RecipeDetail recipe={recipe} />
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
          <Button style={buttonsStyle()} onClick={() => setShowRecipeForm(recipe)} size={"sm"}>
            <Icon path={mdiPencil} size={0.7} />
          </Button>
          <Button style={buttonsStyle()} onClick={() => ""} size={"sm"}>
            <Icon path={mdiDelete} size={0.7} />
          </Button></div>
      </div>
    </div>
  );
}

function componentStyle() {
  return {
    maxWidth: "400px",
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
