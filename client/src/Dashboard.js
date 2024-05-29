import { useContext, useState } from "react";
import { RecipeListContext } from "./RecipeListContext.js";
import { UserContext } from "./UserContext.js";

import Button from "react-bootstrap/esm/Button.js";

import RecipeCard from "./RecipeCard";
import RecipeForm from "./RecipeForm";
import Container from "react-bootstrap/esm/Container.js";
import Row from "react-bootstrap/Row";

import Icon from "@mdi/react";
import { mdiPlusBoxOutline } from "@mdi/js";

function RecipeList() {
  const { recipeList } = useContext(RecipeListContext);
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const { loggedInUser } = useContext(UserContext);

  return (
    <Container>
      {loggedInUser ? (
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <Button variant="success" onClick={() => setShowRecipeForm({})}>
            <Icon path={mdiPlusBoxOutline} size={1} color={"white"} /> Nový Recept
          </Button>
        </div>
      ) : null}
      {!!showRecipeForm ? (
        <RecipeForm recipe={showRecipeForm} setShowRecipeForm={setShowRecipeForm} />
      ) : null}
      <Row>
        {recipeList.map((recipe) => {
          return (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              setShowRecipeForm={setShowRecipeForm}
            />
          );
        })}</Row>

    </Container>
  );
}

export default RecipeList;