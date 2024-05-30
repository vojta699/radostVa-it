import { useContext, useState, useEffect } from "react";
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
  const { recipeList, setRecipeList } = useContext(RecipeListContext);
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const { loggedInUser } = useContext(UserContext);
  const [sortCriteria, setSortCriteria] = useState(''); // Přidáme stav pro sledování kritéria třídění

  // Funkce pro načítání tříděných dat z API
  useEffect(() => {
    let isMounted = true;
    if (sortCriteria) {
      fetch(`http://localhost:8000/recipe/sort/listSortedBy${sortCriteria}`)
        .then(response => response.json())
        .then(data => {
          if (isMounted && JSON.stringify(data) !== JSON.stringify(recipeList)) {
            setRecipeList(data);
          }
        })
        .catch(error => console.error('Error fetching sorted recipes:', error));
    }
    return () => {
      isMounted = false;
    };
  }, [sortCriteria, recipeList, setRecipeList]);

  return (
    <Container>
      <Row>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
          <h5 style={{ textDecoration: "underline", marginBottom: "20px" }}>Všechny recepty ({recipeList.length})</h5>
          {loggedInUser ? (

            <Button variant="success" onClick={() => setShowRecipeForm({})}>
              <Icon path={mdiPlusBoxOutline} size={1} color={"white"} /> Nový Recept
            </Button>

          ) : null}

          {!!showRecipeForm ? (
            <RecipeForm recipe={showRecipeForm} setShowRecipeForm={setShowRecipeForm} />
          ) : null}
        </div>
      </Row>
      <Row>
        <div>
          Třídit dle:
          <button  style={{ margin: "0 10px", borderStyle: "none", backgroundColor: "white" }} onClick={() => setSortCriteria('Name')}>Název</button> 
          <button  style={{ marginRight: "10px", borderStyle: "none", backgroundColor: "white" }} onClick={() => setSortCriteria('Rating')}>Hodnocení</button> 
          <button  style={{ marginRight: "10px", borderStyle: "none", backgroundColor: "white" }} onClick={() => setSortCriteria('Country')}>Země</button>
        </div>
      </Row>
      <Row style={{ margin: "0 auto" }}>
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