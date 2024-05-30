import { useEffect, useState } from "react";
import { RecipeListContext } from "./RecipeListContext.js";

function RecipeListProvider({ children }) {
  const [recipeLoadObject, setRecipeLoadObject] = useState({
    state: "ready",
    error: null,
    data: [],
  });

  useEffect(() => {
    handleLoad();
  }, []);

  async function handleLoad() {
    setRecipeLoadObject((current) => ({ ...current, state: "pending" }));
    try {
      const response = await fetch(`http://localhost:8000/recipe/list`, {
        method: "GET",
      });
      const responseJson = await response.json();
      if (response.status < 400) {
        setRecipeLoadObject({ state: "ready", data: responseJson });
      } else {
        throw new Error(responseJson.error);
      }
    } catch (error) {
      setRecipeLoadObject((current) => ({
        state: "error",
        data: current.data,
        error: error.message,
      }));
      console.error('Error fetching recipes:', error);
    }
  }

  async function handleCreate(dtoIn) {
    setRecipeLoadObject((current) => ({ ...current, state: "pending" }));
    try {
      const response = await fetch(`http://localhost:8000/recipe/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dtoIn),
      });
      const responseJson = await response.json();
      if (response.status < 400) {
        setRecipeLoadObject((current) => ({
          state: "ready",
          data: [...current.data, responseJson],
        }));
      } else {
        throw new Error(responseJson.error);
      }
    } catch (error) {
      setRecipeLoadObject((current) => ({
        state: "error",
        data: current.data,
        error: error.message,
      }));
      console.error('Error creating recipe:', error);
    }
  }

  async function handleUpdate(dtoIn, recipeID, userID) {
    setRecipeLoadObject((current) => ({ ...current, state: "pending" }));
    try {
      const response = await fetch(`http://localhost:8000/recipe/update/${recipeID}/${userID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dtoIn),
      });
      const responseJson = await response.json();
      if (response.status < 400) {
        setRecipeLoadObject((current) => {
          const updatedData = current.data.map((recipe) =>
            recipe.id === recipeID ? responseJson : recipe
          );
          return { state: "ready", data: updatedData };
        });
      } else {
        throw new Error(responseJson.error);
      }
    } catch (error) {
      setRecipeLoadObject((current) => ({
        state: "error",
        data: current.data,
        error: error.message,
      }));
      console.error('Error updating recipe:', error);
    }
  }

  async function handleDelete(recipeID, userID) {
    setRecipeLoadObject((current) => ({ ...current, state: "pending" }));
    try {
      const response = await fetch(`http://localhost:8000/recipe/delete/${recipeID}/${userID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const responseJson = await response.json();
      if (response.status < 400) {
        setRecipeLoadObject((current) => ({
          state: "ready",
          data: current.data.filter((recipe) => recipe.id !== recipeID),
        }));
      } else {
        throw new Error(responseJson.error);
      }
    } catch (error) {
      setRecipeLoadObject((current) => ({
        state: "error",
        data: current.data,
        error: error.message,
      }));
      console.error('Error deleting recipe:', error);
    }
  }

  const value = {
    state: recipeLoadObject.state,
    recipeList: recipeLoadObject.data,
    setRecipeList: (newData) => setRecipeLoadObject((current) => ({ ...current, data: newData })), // Přidání setRecipeList do value objektu
    handlerMap: { handleCreate, handleUpdate, handleDelete },
  };

  return (
    <RecipeListContext.Provider value={value}>
      {children}
    </RecipeListContext.Provider>
  );
}

export default RecipeListProvider;