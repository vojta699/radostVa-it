import { useContext, useState } from "react";
import { RecipeListContext } from "./RecipeListContext.js";

import Button from "react-bootstrap/esm/Button.js";

import RecipeCard from "./RecipeCard";
import RecipeForm from "./RecipeForm";
import Container from "react-bootstrap/esm/Container.js";

import Icon from "@mdi/react";
import { mdiPlusBoxOutline, mdiPlusBoxMultipleOutline } from "@mdi/js";

function RecipeList() {
  const { recipeList } = useContext(RecipeListContext);
  const [showRecipeForm, setShowRecipeForm] = useState(false);
//   const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);

  return (
    <Container>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
        <Button variant="success" onClick={() => setShowRecipeForm({})}>
          <Icon path={mdiPlusBoxOutline} size={1} color={"white"} /> Nový Recept
        </Button>
        {/* <Button variant="success" disabled>
          <Icon path={mdiPlusBoxMultipleOutline} size={1} color={"white"} />{" "}
          Nové události
        </Button> */}
      </div>
      {!!showRecipeForm ? (
        <RecipeForm recipe={showRecipeForm} setShowRecipeForm={setShowRecipeForm} />
      ) : null}
      {recipeList.map((recipe) => {
        return (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            setShowRecipeForm={setShowRecipeForm}
          />
        );
      })}
    </Container>
  );
}

export default RecipeList;