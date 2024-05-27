import { useContext, useState, useEffect } from "react";
import { RecipeListContext } from "./RecipeListContext.js";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import CloseButton from "react-bootstrap/CloseButton";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Icon from "@mdi/react";
import { mdiLoading } from "@mdi/js";

function RecipeForm({ setShowRecipeForm, recipe }) {
    const { state, handlerMap } = useContext(RecipeListContext);
    const [showAlert, setShowAlert] = useState(null);
    const isPending = state === "pending";

    // Enumy ----------------------------------------------------------------------------------------------
    const [countryOptions, setCountryOptions] = useState([])
    const [selectedCountryOption, setSelectedCountryOption] = useState("")
    const [unitsOptions, setUnitsOptions] = useState([])



    // Funkce přidání suroviny + smazání suroviny ----------------------------------------------------------
    const [materialsValue, setMaterialsValue] = useState(recipe.materials || []);

    const [newMaterialName, setNewMaterialName] = useState("");
    const [newMaterialValue, setNewMaterialValue] = useState("");
    const [newMaterialUnit, setNewMaterialUnit] = useState("");

    const handleAddMaterials = () => {
        if (newMaterialName.trim() !== "" && newMaterialValue.trim() !== "" && newMaterialUnit.trim() !== "") {
            let newMaterial = {
                name: newMaterialName,
                value: newMaterialValue,
                unit: newMaterialUnit,
            }
            setMaterialsValue(
                [...materialsValue, newMaterial]
            );
            setNewMaterialName("");
            setNewMaterialValue("");
            setNewMaterialUnit("");
        }
    };
    const handleDeleteMaterials = (name, value, unit) => {
        setMaterialsValue(materialsValue.filter((material) => (material.name !== name && material.value !== value && material.unit !== unit)));
    };

    // Funkce přidání postupu + smazání postupu --------------------------------------------------------------
    const [methods, setMethods] = useState(recipe.method || [])
    const [newMethod, setNewMethod] = useState("")

    const handleAddMethod = () => {
        if (newMethod.trim() !== "") {
            let newStep = {
                steps: `${methods.length + 1}. ${newMethod}`,
            }
            setMethods(
                [...methods, newStep]
            );
            setNewMethod("");
        }
    };
    const handleDeleteMethod = (methodToDelete) => {
        setMethods(methods.filter((method) => (method !== methodToDelete)));
    };

    // Funkce upload obrázek ---------------------------------------------------------------------------------
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [image, setImage] = useState(recipe.imgName || "66dcf3ba9b55edc3abda45e142b02f46.png");

    

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
    };
    const disHandleFileChange = () => {
        const deleteUrl = `http://localhost:8000/recipe/img/delete/${image}`;
        setImage("66dcf3ba9b55edc3abda45e142b02f46.png");
    };
    console.log(image);
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            alert("Please select a file first!");
            return;
        }

        const formData = new FormData();
        formData.append('image', file);
        console.log(formData);
        try {
            const response = await fetch('http://localhost:8000/recipe/img/upload', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert('File uploaded successfully!');
            } else {
                alert('File upload failed!');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error uploading file!');
        }
    };

    // Fetch Enumů --------------------------------------------------------------------------------------------
    useEffect(() => {
        fetch(`http://localhost:8000/enum/country`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const countryData = data.map((country, index) => ({
                    id: index + 1,
                    name: country,
                }));
                setCountryOptions(countryData);
            })
            .catch(error => console.log(error));
        fetch(`http://localhost:8000/enum/units`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const unitData = data.map((unit, index) => ({
                    id: index + 1,
                    name: unit,
                }));
                setUnitsOptions(unitData);
            })
            .catch(error => console.log(error));
    }, []);

    return (

        // Formulář ----------------------------------------------------------------------

        <Modal size="lg" show={true} onHide={() => setShowRecipeForm(false)}>
            <Form
                onSubmit={async (e) => {
                    e.prrecipeDefault();
                    e.stopPropagation();
                    var formData = Object.fromEntries(new FormData(e.target));
                    formData.date = new Date(formData.date).toISOString();
                    try {
                        if (recipe.id) {
                            formData.id = recipe.id;
                            await handlerMap.handleUpdate(formData);
                        } else {
                            await handlerMap.handleCreate(formData);
                        }

                        setShowRecipeForm(false);
                    } catch (e) {
                        console.error(e);
                        setShowAlert(e.message);
                    }
                }}
            >
                {/* Název Formuláře *******************************************************************/}

                <Modal.Header>
                    <Modal.Title>{`${recipe.id ? "Upravit" : "Vytvořit"} recept`}
                    </Modal.Title>
                    <CloseButton onClick={() => setShowRecipeForm(false)} />
                </Modal.Header>
                <Modal.Body style={{ position: "relative" }}>
                    <Alert
                        show={!!showAlert}
                        variant="danger"
                        dismissible
                        onClose={() => setShowAlert(null)}
                    >
                        <Alert.Heading>Nepodařilo se vytvořit recept</Alert.Heading>
                        <pre>{showAlert}</pre>
                    </Alert>

                    {isPending ? (
                        <div style={pendingStyle()}>
                            <Icon path={mdiLoading} size={2} spin />
                        </div>
                    ) : null}

                    {/* Název receptu ********************************************************************/}

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Název receptu</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            required
                            defaultValue={recipe.name}
                        />
                    </Form.Group>

                    {/* Země původu ********************************************************************/}

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Země původu</Form.Label>
                        <Form.Select
                            value={selectedCountryOption}
                            onChange={(e) => {
                                setSelectedCountryOption(e.target.value)
                            }}
                        >
                            <option value="">Vyber zemi</option>
                            {countryOptions.map((country) => (
                                <option key={country.id} value={country.id}>
                                    {country.name}
                                </option>
                            ))}


                        </Form.Select>
                    </Form.Group>

                    {/* Porce ********************************************************************/}

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Počet porcí</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            required
                            defaultValue={recipe.portion}
                        />
                    </Form.Group>

                    {/* Suroviny ********************************************************************/}

                    <Form.Group
                        as={Col}
                        className="mb-3"
                        controlId="formBasicEmail"
                    >
                        <Form.Label>Suroviny</Form.Label>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    defaultValue=""
                                    value={newMaterialName}
                                    onChange={(e) => {
                                        setNewMaterialName(e.target.value);
                                    }}>
                                </Form.Control>
                            </Col>
                            <Col md={3}>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    defaultValue=""
                                    value={newMaterialValue}
                                    onChange={(e) => {
                                        setNewMaterialValue(e.target.value);
                                    }}>
                                </Form.Control>
                            </Col>
                            <Col md={3}>
                                <Form.Select
                                    value={newMaterialUnit}
                                    onChange={(e) => {
                                        setNewMaterialUnit(e.target.value);
                                    }}
                                >
                                    <option value="">
                                        Vyber jednotku
                                    </option>
                                    {unitsOptions.map((option) => (
                                        <option key={option.id} value={option.name}>
                                            {option.name}
                                        </option>
                                    ))}

                                </Form.Select>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group
                        as={Col}
                        className="mb-3"
                        controlId="formBasicEmail"
                    >
                        <Button variant="primary" onClick={handleAddMaterials}>
                            Přidat surovinu
                        </Button>
                    </Form.Group>
                    {materialsValue
                        .map((material) => (
                            <Row className="mb-3">
                                <Col md={5}>
                                    <p
                                        key={material.id}
                                        style={{
                                            backgroundColor: "pink",
                                            textAlign: "center",
                                        }}
                                    >
                                        <b>
                                            {material.name}
                                        </b>
                                    </p>
                                </Col>
                                <Col md={5}>
                                    <p
                                        key={material.id}
                                        style={{
                                            backgroundColor: "pink",
                                            textAlign: "center",
                                        }}
                                    >
                                        <b>
                                            {material.value}{" "}{material.unit}
                                        </b>
                                    </p>
                                </Col>
                                <Col md={2}>
                                    <Button
                                        variant="danger"
                                        onClick={() =>
                                            handleDeleteMaterials(material.name, material.value, material.unit)
                                        }
                                        style={{ display: "flex" }}
                                    >
                                        Smazat
                                    </Button>
                                </Col>
                            </Row>
                        ))}

                    {/* Postup ********************************************************************/}

                    <Form.Group
                        as={Col}
                        className="mb-3"
                        controlId="formBasicEmail"
                    >
                        <Form.Label>Postup</Form.Label>
                        <Row className="mb-3">
                            <Col md={12}>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    defaultValue=""
                                    value={newMethod}
                                    onChange={(e) => {
                                        setNewMethod(e.target.value);
                                    }}>
                                </Form.Control>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group
                        as={Col}
                        className="mb-3"
                        controlId="formBasicEmail"
                    >
                        <Button variant="primary" onClick={handleAddMethod}>
                            Přidat postup
                        </Button>
                    </Form.Group>
                    {methods
                        .map((method) => (
                            <Row className="mb-3">
                                <Col md={10}>
                                    <p
                                        key={method.id}
                                        style={{
                                            backgroundColor: "pink",
                                            textAlign: "center",
                                        }}
                                    >
                                        <b>
                                            {method.steps}
                                        </b>
                                    </p>
                                </Col>
                                <Col md={2}>
                                    <Button
                                        variant="danger"
                                        onClick={() =>
                                            handleDeleteMethod(method)
                                        }
                                        style={{ display: "flex" }}
                                    >
                                        Smazat
                                    </Button>
                                </Col>
                            </Row>
                        ))}

                    {/* Obrázek ********************************************************************/}

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Obrázek</Form.Label>
                    </Form.Group>
                    <Form onSubmit={handleSubmit}>

                        {(image === "66dcf3ba9b55edc3abda45e142b02f46.png") ?
                            <>
                                <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
                                <Button variant="primary" disabled={isPending}>Upload</Button>
                                {preview === null ?
                                    <>
                                    </> : <>
                                        {preview && <img src={preview} alt="Preview" style={{ width: '170px', height: '150px', marginTop: '10px' }} />}
                                    </>}
                            </> : <>
                                <p>
                                    {image}
                                </p>
                                <Button variant="danger" onClick={() => disHandleFileChange()}>Smazat</Button>
                            </>}
                    </Form>

                    {/* ´-------------------------------------------------------------------- */}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="danger"
                        onClick={() => setShowRecipeForm(false)}
                        disabled={isPending}
                    >
                        Zavřít
                    </Button>
                    <Button type="submit" variant="primary" disabled={isPending}>
                        {recipe.id ? "Upravit" : "Vytvořit"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

// Stylování

function pendingStyle() {
    return {
        position: "absolute",
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        opacity: "0.5",
    };
}

export default RecipeForm;
