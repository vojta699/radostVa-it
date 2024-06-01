import { useContext, useState, useEffect, useCallback } from "react";
import { UserContext } from "./UserContext.js";
import { RecipeListContext } from "./RecipeListContext.js";
import { ImageContext } from "./ImageContext.js";


import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import CloseButton from "react-bootstrap/CloseButton";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Icon from "@mdi/react";
import { mdiLoading, mdiDelete, mdiPencil } from "@mdi/js";

function RecipeForm({ setShowRecipeForm, recipe }) {
    const { state, handlerMap } = useContext(RecipeListContext);
    const { loggedInUser } = useContext(UserContext);
    const { ImagehandlerMap } = useContext(ImageContext)
    const { fetchImage, handleSubmitImg, handleDeleteImg } = ImagehandlerMap
    const [showAlert, setShowAlert] = useState(null);
    const isPending = state === "pending";

    // Enumy ----------------------------------------------------------------------------------------------
    const [countryOptions, setCountryOptions] = useState([])
    const [selectedCountryOption, setSelectedCountryOption] = useState(recipe.countryOfOrigin || "")
    const [unitsOptions, setUnitsOptions] = useState([])

    // Funkce SUROVINY - kontrola existence + přidání + editaci + smazání ----------------------------------------------------------
    const [materials, setMaterials] = useState(recipe.materials || []);
    const [newMaterialName, setNewMaterialName] = useState("");
    const [newMaterialValue, setNewMaterialValue] = useState("");
    const [newMaterialUnit, setNewMaterialUnit] = useState("");
    const [editMaterialIndex, setEditMaterialIndex] = useState(null);
    const [isMaterialEditing, setIsMaterialEditing] = useState(false);
    const [materialsFilled, setMaterialsFilled] = useState(false)

    // Kontrola existence --- nelze odeslat
    const checkMaterialsFilled = useCallback(() => {
        return materials.length > 0; // Vrátí true, pokud pole materiálů obsahuje alespoň jeden objekt
    }, [materials])

    useEffect(() => {
        setMaterialsFilled(checkMaterialsFilled());
    }, [materials, checkMaterialsFilled]);

    // Přidání suroviny
    const handleAddMaterials = () => {
        if (newMaterialName.trim() !== "" && newMaterialValue.trim() !== "" && newMaterialUnit.trim() !== "") {
            let newMaterial = {
                name: newMaterialName,
                value: parseInt(newMaterialValue),
                unit: newMaterialUnit,
            }
            setMaterials(
                [...materials, newMaterial]
            );
            setNewMaterialName("");
            setNewMaterialValue("");
            setNewMaterialUnit("");
        }
    };
    // Editace suroviny
    const handleEditMaterial = (index, materialToEdit) => {
        setNewMaterialName(materialToEdit.name);
        setNewMaterialValue(materialToEdit.value);
        setNewMaterialUnit(materialToEdit.unit);
        setEditMaterialIndex(index);
        setIsMaterialEditing(true);
    };

    const handleSaveMaterial = () => {
        const updatedMaterials = materials.map((item, index) =>
            index === editMaterialIndex
                ? { ...item, name: newMaterialName, value: newMaterialValue, unit: newMaterialUnit }
                : item
        );
        setMaterials(updatedMaterials);
        setNewMaterialName("");
        setNewMaterialValue("");
        setNewMaterialUnit("");
        setEditMaterialIndex(null);
        setIsMaterialEditing(false);
    };
    // Smazání suroviny
    const handleDeleteMaterials = (index) => {
        setMaterials(materials.filter((_, i) => i !== index));
    };

    // Funkce POSTUP - kontrola existence + přidání + editaci + smazání --------------------------------------------------------------
    const [method, setMethod] = useState(recipe.method || [])
    const [newMethod, setNewMethod] = useState("")
    const [editMethodIndex, setEditMethodIndex] = useState(null);
    const [methodIsEditing, setIsMethodEditing] = useState(false);
    const [methodsFilled, setMethodsFilled] = useState(false)

    // Kontrola existence --- nelze odeslat
    const checkMethodsFilled = useCallback(() => {
        return method.length > 0; // Vrátí true, pokud pole postupů obsahuje alespoň jeden objekt
    }, [method])

    useEffect(() => {
        setMethodsFilled(checkMethodsFilled());
    }, [method, checkMethodsFilled]);

    // Přidání postupu
    const handleAddMethod = () => {
        if (newMethod.trim() !== "") {
            let newStep = {
                steps: `${newMethod}`,
            }
            setMethod(
                [...method, newStep]
            );
            setNewMethod("");
        }
    };
    const handleEditMethod = (index, methodToEdit) => {
        setNewMethod(methodToEdit.steps);
        setEditMethodIndex(index);
        setIsMethodEditing(true);
    };
    // Editace postupu
    const handleSaveMethod = () => {
        const updatedMethods = method.map((item, index) =>
            index === editMethodIndex ? { ...item, steps: newMethod } : item
        );
        setMethod(updatedMethods);
        setNewMethod("");
        setEditMethodIndex(null);
        setIsMethodEditing(false);
    };
    // Smazání postupu
    const handleDeleteMethod = (methodToDelete) => {
        setMethod(method.filter((method) => (method !== methodToDelete)));
    };

    // Funkce upload obrázek ---------------------------------------------------------------------------------
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [image, setImage] = useState(recipe.imgName || "66dcf3ba9b55edc3abda45e142b02f46.png");
    const [imageToDelete, setImageToDelete] = useState(null)
    const [base64, setBase64] = useState()

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
    };
    const deleteFile = () => {
        setImageToDelete(image)
        setImage("66dcf3ba9b55edc3abda45e142b02f46.png");
    };

    const disHandleFileChange = (event) => {
        setFile(null)
        setPreview(null)
        document.getElementById('fileInput').value = ''
    };

    useEffect(() => {
        if (recipe.imgName) {
            fetchImage(recipe.imgName)
                .then(data => {
                    setBase64(data);
                })
                .catch(error => console.log(error));
        }
    }, [fetchImage, recipe.imgName]);

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
                    e.preventDefault();
                    e.stopPropagation();
                    var formData = Object.fromEntries(new FormData(e.target))
                    Object.assign(formData, { method, materials, "user_ID": loggedInUser.id })
                    formData.portion = parseInt(formData.portion)
                    formData.duration = parseInt(formData.duration)
                    formData.materials.forEach((material) => {
                        material.value = parseInt(material.value);
                    })

                    try {
                        let uploadedImageName = null;
                        if (file !== null) {
                            uploadedImageName = await handleSubmitImg(file);
                        }

                        if (recipe.id) {
                            formData.user_ID = undefined;
                            if (uploadedImageName) {
                                Object.assign(formData, { "imgName": uploadedImageName });
                                if (imageToDelete) {
                                    await handleDeleteImg(imageToDelete);
                                }
                            } else if (!uploadedImageName && imageToDelete) {
                                await handleDeleteImg(imageToDelete);
                                Object.assign(formData, { "imgName": image });
                            }

                            await handlerMap.handleUpdate(formData, recipe.id, loggedInUser.id);
                        } else {
                            if (uploadedImageName) {
                                Object.assign(formData, { "imgName": uploadedImageName });
                            }

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
                            minLength={3}
                            maxLength={30}
                            required
                            defaultValue={recipe.name}
                        />
                    </Form.Group>

                    {/* Země původu ********************************************************************/}

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Země původu</Form.Label>
                        <Form.Select
                            name="countryOfOrigin"
                            value={selectedCountryOption}
                            onChange={(e) => {
                                setSelectedCountryOption(e.target.value)
                            }}
                            required
                        >
                            <option value="">Vyber zemi</option>
                            {countryOptions.map((country, index) => (
                                <option key={index} value={country.name}>
                                    {country.name}
                                </option>
                            ))}


                        </Form.Select>
                    </Form.Group>

                    {/* Doba přípravy + porce ****************************************************************/}

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Row className="mb-3">
                            <Col md={8}>
                                <Form.Label>Dobra přípravy</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="duration"
                                    placeholder="Uvedtě dobu potřebnou na přípravu receptu v minutách. Max 300."
                                    required
                                    defaultValue={recipe.duration}
                                    min="1"
                                    max="300"
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Label>Počet porcí</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="portion"
                                    placeholder="1-10"
                                    required
                                    defaultValue={recipe.portion}
                                    min="1"
                                    max="10"
                                />
                            </Col>
                        </Row>
                    </Form.Group>

                    {/* Suroviny ********************************************************************/}
                    <Form.Group as={Col} className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Suroviny</Form.Label>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Control
                                    type="text"
                                    placeholder="Název suroviny"
                                    value={newMaterialName}
                                    minLength={3}
                                    maxLength={30}
                                    onChange={(e) => {
                                        setNewMaterialName(e.target.value);
                                    }}
                                ></Form.Control>
                            </Col>
                            <Col md={3}>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    placeholder="Množství"
                                    value={newMaterialValue}
                                    onChange={(e) => {
                                        setNewMaterialValue(e.target.value);
                                    }}
                                ></Form.Control>
                            </Col>
                            <Col md={3}>
                                <Form.Select
                                    value={newMaterialUnit}
                                    onChange={(e) => {
                                        setNewMaterialUnit(e.target.value);
                                    }}
                                >
                                    <option value="">Vyber jednotku</option>
                                    {unitsOptions.map((option, index) => (
                                        <option key={index} value={option.name}>
                                            {option.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group as={Col} className="mb-3" controlId="formBasicEmail">
                        {isMaterialEditing ? (
                            <Button variant="primary" onClick={handleSaveMaterial}>
                                Upravit surovinu
                            </Button>
                        ) : (
                            <Button variant="primary" onClick={handleAddMaterials}>
                                Přidat surovinu
                            </Button>
                        )}
                    </Form.Group>
                    {materials.map((material, index) => (
                        <Row className="mb-3" key={index}>
                            <Col md={5}>
                                <p
                                    style={{
                                        backgroundColor: "pink",
                                        textAlign: "center",
                                    }}
                                >
                                    <b>{material.name}</b>
                                </p>
                            </Col>
                            <Col md={4}>
                                <p
                                    style={{
                                        backgroundColor: "pink",
                                        textAlign: "center",
                                    }}
                                >
                                    <b>
                                        {material.value} {material.unit}
                                    </b>
                                </p>
                            </Col>
                            <Col style={{ marginRight: "10px", marginBottom: "10px" }} md={1}>
                                <Button
                                    variant="primary"
                                    onClick={() => handleEditMaterial(index, material)}
                                    style={{ display: "flex" }}
                                >
                                    <Icon path={mdiPencil} size={0.7} />
                                </Button>
                            </Col>
                            <Col md={1}>
                                <Button
                                    variant="danger"
                                    onClick={() => handleDeleteMaterials(index)}
                                    style={{ display: "flex" }}
                                >
                                    <Icon path={mdiDelete} size={0.7} />
                                </Button>
                            </Col>
                        </Row>
                    ))}

                    {/* Postup ********************************************************************/}

                    <Form.Group as={Col} className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Postup</Form.Label>
                        <Row className="mb-3">
                            <Col md={12}>
                                <Form.Control
                                    type="text"
                                    as="textarea"
                                    maxLength={300}
                                    placeholder="Zadejte postup receptu, poté ho přidejte. Max 300 znaků."
                                    value={newMethod}
                                    onChange={(e) => {
                                        setNewMethod(e.target.value);
                                    }}
                                ></Form.Control>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group as={Col} className="mb-3" controlId="formBasicEmail">
                        {methodIsEditing ? (
                            <Button variant="primary" onClick={handleSaveMethod}>
                                Upravit postup
                            </Button>
                        ) : (
                            <Button variant="primary" onClick={handleAddMethod}>
                                Přidat postup
                            </Button>
                        )}
                    </Form.Group>
                    {method.map((method, index) => (
                        <Row className="mb-3" key={index}>
                            <Col md={9}>
                                <p
                                    style={{
                                        backgroundColor: "pink",
                                        textAlign: "center",
                                    }}
                                >
                                    <b>
                                        {index + 1}. {method.steps}
                                    </b>
                                </p>
                            </Col>
                            <Col style={{ marginRight: "10px", marginBottom: "10px" }} md={1}>
                                <Button
                                    variant="primary"
                                    onClick={() => handleEditMethod(index, method)}
                                    style={{ display: "flex" }}
                                >
                                    <Icon path={mdiPencil} size={0.7} />
                                </Button>

                            </Col>
                            <Col md={1}>
                                <Button
                                    variant="danger"
                                    onClick={() => handleDeleteMethod(method)}
                                    style={{ display: "flex" }}
                                >
                                    <Icon path={mdiDelete} size={0.7} />
                                </Button>

                            </Col>
                        </Row>
                    ))}

                    {/* Obrázek ********************************************************************/}

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Obrázek</Form.Label>
                    </Form.Group>
                    <Form.Group
                        as={Col}
                        className="mb-3"

                    >

                        {(image === "66dcf3ba9b55edc3abda45e142b02f46.png") ?
                            <>
                                <Form.Control type="file" accept="image/*" onChange={handleFileChange} id="fileInput" />

                                {preview === null ?
                                    <>
                                    </> : <>
                                        {preview && <img src={preview} alt="Preview" style={{ width: '200px', height: '150px', marginTop: '10px' }} />}
                                        <Button style={{ marginLeft: "20px" }} variant="danger" onClick={() => disHandleFileChange()}>Zrušit</Button>
                                    </>}
                            </> : <>
                                {base64 && <img style={{ width: '200px', height: '150px', marginTop: '10px' }} src={`data:image/jpeg;base64,${base64}`} alt="Preview" />}
                                <Button style={{ marginLeft: "20px" }} variant="danger" onClick={() => deleteFile()}>Smazat</Button>
                            </>}
                    </Form.Group>

                    {/* ´-------------------------------------------------------------------- */}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="danger"
                        onClick={() => setShowRecipeForm(false)}
                        disabled={isPending}
                    >
                        Zrušit
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={!materialsFilled || !methodsFilled || isPending}
                    >
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
