import { useState, useEffect, useContext } from "react";
import { ImageContext } from "./ImageContext.js";

function RecipeCardImage({ recipe }) {

  const [base64, setBase64] = useState()
  const { ImagehandlerMap } = useContext(ImageContext);
  const { fetchImage } = ImagehandlerMap

  useEffect(() => {
    if (recipe.imgName) {
      fetchImage(recipe.imgName)
        .then(data => {
          setBase64(data);
        })
        .catch(error => console.log(error));
    }
  }, [fetchImage, recipe.imgName]);

  return (
    <div style={{ display: "grid", rowGap: "4px" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>{base64 ? (
        <img style={{ maxWidth: "280px", height: "180px" }} src={`data:image/jpeg;base64,${base64}`} alt="" />
      ) : (
        <p>Loading...</p>
      )}</div>
    </div>
  );
}

export default RecipeCardImage;
