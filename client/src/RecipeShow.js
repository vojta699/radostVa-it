import React from 'react';
import { useState, useEffect, useContext } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import RatingComponent from "./RatingComponent"
import { ImageContext } from "./ImageContext.js";

function RecipeShow({ recipe }) {
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

  function minutes() {
    let time = ""
    if(recipe.duration === 1){
      time = "minuta"
    } else if(recipe.duration > 1 && recipe.duration < 5){
      time = "minuty"
    } else {
      time = "minut"
    }
    return time
  }

  return (
    <>
    <div >
    
    <Row>
        <Col md={6}>
            <div style={{ display: "grid", rowGap: "4px" }}>
              <div>{base64 ? (
                <img style={{ maxWidth: "50vh", maxHeight: "35vh" }} src={`data:image/jpeg;base64,${base64}`} alt="" />
              ) : (
                <p>Loading...</p>
              )}</div>
              </div>
          </Col>
          <Col md={6}>
            <div style={{ fontSize: "22px" }}>{recipe.name}</div>
            <div style={{ fontSize: "12px" }}>{recipe.countryOfOrigin}</div>
            <RatingComponent recipeId={recipe.id} />
            <br />
            <div style={{ fontSize: "15px" }}>Čas: {recipe.duration} {minutes()}</div>
            <div style={{ fontSize: "15px" }}>Množství: {recipe.portion} porce</div>
          </Col>


      </Row >

      <br />
      <Row>

        <Col md={6}>
          <h5>Suroviny:</h5>
          <Row>
            {recipe.materials.map((material, index) => (
              <React.Fragment key={index}>
              <>
                <Col md={6}>
                  <p
                   
                    style={{
                      fontSize: "15px",
                    }}
                  >
                    {material.name}
                  </p>
                </Col>
                <Col md={6}>
                  <p
                    
                    style={{
                      fontSize: "15px",
                    }}
                  >
                    {material.value}{" "}{material.unit}
                  </p>
                </Col>
              </>
              </React.Fragment>
            ))}
          </Row>
        </Col>


        <Col md={6}>
          <h5>Postup:</h5>
          {recipe.method.map((method, index) => (
            <React.Fragment key={index}>
            <p
              
            >
              {method.steps}
            </p>
            </React.Fragment>
          ))}
        </Col>
      </Row>
    </div >
    </>
  );
}

export default RecipeShow;
