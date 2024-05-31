import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { RecipeContext } from "./RecipeContext.js";

function RecipeProvider({ children }) {
  const [recipeLoadObject, setRecipeLoadObject] = useState({
    state: "pending",
    error: null,
    data: null,
  });
  const location = useLocation();

  /* eslint-disable */
  useEffect(() => {
    handleLoad();
  }, []);
  /* eslint-enable */

  async function handleLoad() {
    setRecipeLoadObject((current) => ({ ...current, state: "pending" }));
    const response = await fetch(
      `http://localhost:8000/recipe/get/${new URLSearchParams(
        location.search
      ).get("id")}`,
      {
        method: "GET",
      }
    );
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
    }
  }

  const value = {
    state: recipeLoadObject.state,
    recipe: recipeLoadObject.data
  };

  return (
    <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>
  );
}

export default RecipeProvider;