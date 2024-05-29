import { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
// import { ImageContext } from "./ImageContext.js";

function RecipeShow({ recipe }) {

  // const { base64 } = useContext(ImageContext);
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
    <>
    <div >
    
    <Row>
        <Col md={6}>
            <div style={{ display: "grid", rowGap: "4px" }}>
              <div>{base64 ? (
                <img style={{ maxWidth: "60vh", maxHeight: "32vh" }} src={`data:image/jpeg;base64,${base64}`} alt="" />
              ) : (
                <p>Loading...</p>
              )}</div>
              </div>
          </Col>
          <Col md={6}>
            <div style={{ fontSize: "22px" }}>{recipe.name}</div>
            <div style={{ fontSize: "12px" }}>{recipe.countryOfOrigin}</div>
            <br />
            <div style={{ fontSize: "15px" }}>Čas: </div>
            <div style={{ fontSize: "15px" }}>Množství: {recipe.portion} porce</div>
          </Col>


      </Row >

      <br />
      <Row>

        <Col md={6}>
          <h5>Suroviny:</h5>
          <Row>
            {recipe.materials.map((material) => (

              <>
                <Col md={6}>
                  <p
                    key={material.id}
                    style={{
                      fontSize: "15px",
                    }}
                  >
                    {material.name}
                  </p>
                </Col>
                <Col md={6}>
                  <p
                    key={material.id}
                    style={{
                      fontSize: "15px",
                    }}
                  >
                    {material.value}{" "}{material.unit}
                  </p>
                </Col>
              </>

            ))}
          </Row>
        </Col>


        <Col md={6}>
          <h5>Postup:</h5>
          {recipe.method.map((method) => (
            <p
              key={method.id}
            >
              {method.steps}
            </p>
          ))}
        </Col>
      </Row>
    </div >
    </>
  );
}

export default RecipeShow;
