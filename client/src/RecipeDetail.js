import { useState, useEffect } from "react";
import { ImageContext } from "./ImageContext.js";

function RecipeDetail({ recipe }) {
  
  const [base64, setBase64] = useState()


  useEffect(() => {
    fetch(`http://localhost:8000/recipe/img/get/${recipe.imgName}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(data => {
        setBase64(data);
      })
      .catch(error => console.log(error));
  }, [recipe.imgName]);

  return (
    <div style={{ display: "grid", rowGap: "4px" }}>
      <div>{base64 ? (
        <img style={{ width: "200px", height: "140px" }} src={`data:image/jpeg;base64,${base64}`} alt="" />
      ) : (
        <p>Loading...</p>
      )}</div>
      <div style={{ fontSize: "22px" }}>{recipe.name}</div>

    </div>
  );
}

export default RecipeDetail;
