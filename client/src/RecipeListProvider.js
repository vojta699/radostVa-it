import { useEffect, useState } from "react";
import { RecipeListContext } from "./RecipeListContext.js";

function RecipeListProvider({ children }) {
  const [recipeLoadObject, setRecipeLoadObject] = useState({
    state: "ready",
    error: null,
    data: null,
  });

  useEffect(() => {
    handleLoad();
  }, []);

  async function handleLoad() {
    setRecipeLoadObject((current) => ({ ...current, state: "pending" }));
    const response = await fetch(`http://localhost:8000/recipe/list`, {
      method: "GET",
    });
    const responseJson = await response.json();
    if (response.status < 400) {
      setRecipeLoadObject({ state: "ready", data: responseJson });
      return responseJson;
    } else {
      setRecipeLoadObject((current) => ({
        state: "error",
        data: current.data,
        error: responseJson.error,
      }));
      throw new Error(JSON.stringify(responseJson, null, 2));
    }
  }

  async function handleCreate(dtoIn) {
    setRecipeLoadObject((current) => ({ ...current, state: "pending" }));
    const response = await fetch(`http://localhost:8000/recipe/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dtoIn),
    });
    const responseJson = await response.json();

    if (response.status < 400) {
      setRecipeLoadObject((current) => {
        current.data.push(responseJson);
        return { state: "ready", data: current.data };
      });
      return responseJson;
    } else {
      setRecipeLoadObject((current) => {
        return { state: "error", data: current.data, error: responseJson };
      });
      throw new Error(JSON.stringify(responseJson, null, 2));
    }
  }

  async function handleUpdate(dtoIn) {
    setRecipeLoadObject((current) => ({ ...current, state: "pending" }));
    const response = await fetch(`http://localhost:8000/recipe/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dtoIn),
    });
    const responseJson = await response.json();

    if (response.status < 400) {
      setRecipeLoadObject((current) => {
        const recipeIndex = current.data.findIndex(
          (e) => e.id === responseJson.id
        );
        current.data[recipeIndex] = responseJson;
        return { state: "ready", data: current.data };
      });
      return responseJson;
    } else {
      setRecipeLoadObject((current) => ({
        state: "error",
        data: current.data,
        error: responseJson,
      }));
      throw new Error(JSON.stringify(responseJson, null, 2));
    }
  }

  async function handleDelete(dtoIn) {
    setRecipeLoadObject((current) => ({ ...current, state: "pending" }));
    const response = await fetch(`http://localhost:8000/recipe/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dtoIn),
    });
    const responseJson = await response.json();

    if (response.status < 400) {
      setRecipeLoadObject((current) => {
        const recipeIndex = current.data.findIndex(
          (e) => e.id === responseJson.id
        );
        current.data.splice(recipeIndex, 1);
        return { state: "ready", data: current.data };
      });
      return responseJson;
    } else {
      setRecipeLoadObject((current) => ({
        state: "error",
        data: current.data,
        error: responseJson,
      }));
      throw new Error(JSON.stringify(responseJson, null, 2));
    }
  }


  const value = {
    state: recipeLoadObject.state,
    recipeList: recipeLoadObject.data || [],
    handlerMap: { handleCreate, handleUpdate, handleDelete },
  };

  return (
    <RecipeListContext.Provider value={value}>
      {children}
    </RecipeListContext.Provider>
  );
}

export default RecipeListProvider;