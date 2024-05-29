import { useContext } from "react";
import { RecipeContext } from "./RecipeContext";

import Button from "react-bootstrap/esm/Button.js";
import { useNavigate } from "react-router-dom";

import RecipeShow from "./RecipeShow";

function RecipeRoute() {
  const navigate = useNavigate();

  const { state, recipe } = useContext(RecipeContext);

  let child = null;
  switch (state) {
    case "ready":
      child = (
        <>

          <div
            className="card border-0 shadow rounded"
            style={componentStyle()}
          >


            <RecipeShow recipe={recipe} />
            <div style={{ display:"flex", justifyContent:"center"}}>
            <Button style={{ marginTop:"15px", maxWidth:"100px" }} onClick={() => navigate("/")}>
              Zpět
            </Button>
            </div>
          </div>



        </>
      );
      break;
    case "pending":
      child = "loading...";
      break;
    case "error":
      child = "error";
      break;
    default:
      child = "loading...";
  }

  return child;
}

function componentStyle() {
  return {
    margin: "12px auto",
    padding: "8px",
    display: "grid",
    columnGap: "8px",
    maxWidth: "1000px",
  };
}

export default RecipeRoute;