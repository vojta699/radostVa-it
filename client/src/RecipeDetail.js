import { useState, useEffect } from "react";

function RecipeDetail({ recipe }) {

  const [image, setImage] = useState()


  useEffect(() => {
    fetch(`http://localhost:8000/recipe/img/get/${recipe.imgName}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setImage(data);
      })
      .catch(error => console.log(error));
  }, []);



  console.log(image);

  return (
    <div style={{ display: "grid", rowGap: "4px" }}>
      {/* <div>{image}</div> */}
      <div style={{ fontSize: "22px" }}>{recipe.name}</div>
    </div>
  );
}

function decisionColumnStyle() {
  return { display: "flex", justifyContent: "right", padding: "0" };
}

export default RecipeDetail;
