import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { RecipeListContext } from "./RecipeListContext.js";
import { UserContext } from "./UserContext.js";

import RecipeCardDetail from "./RecipeCardDetail";
import RatingComponent from "./RatingComponent"

import Button from "react-bootstrap/esm/Button.js";
import Modal from "react-bootstrap/Modal";
import Icon from "@mdi/react";
import { mdiDelete, mdiEyeOutline, mdiPencil } from "@mdi/js";

function RecipeCard({ recipe, setShowRecipeForm }) {
  const { loggedInUser } = useContext(UserContext);
  const { handlerMap } = useContext(RecipeListContext);
  const [showConfirmation, setShowConfirmation] = useState(false)

  const navigate = useNavigate();

  // Funkce spouštějící Delete přes formulář
  const handleDeleteConfirmation = async (recipeID, userID) => {
    await handlerMap.handleDelete(recipeID, userID);
    setShowConfirmation(false);
  };

  return (
    <div className="card border-0 shadow rounded" style={componentStyle()}>

      <RecipeCardDetail recipe={recipe} />
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
              <Button style={buttonsStyle()} variant="danger" onClick={() => setShowConfirmation(true)} size={"sm"}>
                <Icon path={mdiDelete} size={0.7} />
              </Button>
            </div>
          ) : null}
        </div>
      </div>
      <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Potvrzení</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Opravdu chcete smazat tento recept?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmation(false)}>
            Zrušit
          </Button>
          <Button variant="danger" onClick={(index) => handleDeleteConfirmation(recipe.id, loggedInUser.id)}>
            Potvrdit
          </Button>
        </Modal.Footer>
      </Modal>



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
