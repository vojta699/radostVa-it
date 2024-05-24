import { useContext, useState, useEffect } from "react";
import { RecipeListContext } from "./RecipeListContext.js";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import CloseButton from "react-bootstrap/CloseButton";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

import Icon from "@mdi/react";
import { mdiLoading } from "@mdi/js";

function RecipeForm({ setShowRecipeForm, recipe }) {
    const { state, handlerMap } = useContext(RecipeListContext);
    const [showAlert, setShowAlert] = useState(null);
    const isPending = state === "pending";

    const [countryOptions, setCountryOptions] = useState([])
    const [selectedCountryOption, setSelectedCountryOption] = useState("")

    const [unitsOptions, setUnitsOptions] = useState([])
    const [selectedUnitsOption, setSelectedUnitsOption] = useState("")

    const [method, setMethod] = useState(recipe.method || [])

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
        <Modal show={true} onHide={() => setShowRecipeForm(false)}>
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
                <Modal.Header>
                    <Modal.Title>{`${recipe.id ? "Upravit" : "Vytvořit"
                        } událost`}</Modal.Title>
                    <CloseButton onClick={() => setShowRecipeForm(false)} />
                </Modal.Header>
                <Modal.Body style={{ position: "relative" }}>
                    <Alert
                        show={!!showAlert}
                        variant="danger"
                        dismissible
                        onClose={() => setShowAlert(null)}
                    >
                        <Alert.Heading>Nepodařilo se vytvořit událost</Alert.Heading>
                        <pre>{showAlert}</pre>
                    </Alert>

                    {isPending ? (
                        <div style={pendingStyle()}>
                            <Icon path={mdiLoading} size={2} spin />
                        </div>
                    ) : null}

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Název receptu</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            required
                            defaultValue={recipe.name}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Země původu</Form.Label>
                        <Form.Select
                            value={selectedCountryOption}
                            onChange={(e) => {
                                setSelectedCountryOption(e.target.value)
                            }}
                        >
                            <option value="">Select country</option>
                            {countryOptions.map((country) => (
                                <option key={country.id} value={country.id}>
                                    {country.name}
                                </option>
                            ))}


                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Počet porcí</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            required
                            defaultValue={recipe.portion}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Suroviny</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            required
                            defaultValue={recipe.materials}
                        />
                    </Form.Group>
                    <Button
                        variant="secondary"
                        onClick={() => setShowRecipeForm(false)}
                        disabled={isPending}
                    >
                        Přidat surovinu
                    </Button>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Postup</Form.Label>
                        {method.map((step) => (
                            <Form.Control
                                type="text"
                                name="name"
                                required
                                defaultValue={step.steps}
                            />
                        ))}


                    </Form.Group>
                    <Button
                        variant="secondary"
                        onClick={() => setShowRecipeForm(false)}
                        disabled={isPending}
                    >
                        Přidat řádek
                    </Button>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Obrázek</Form.Label>
                        {recipe.imgName === "66dcf3ba9b55edc3abda45e142b02f46.png" ?
                            <>
                            </> : <>
                                <p>
                                    {recipe.imgName}
                                </p>
                            </>}
                    </Form.Group>
                    {(recipe.imgName === "66dcf3ba9b55edc3abda45e142b02f46.png" || recipe.imgName === undefined) ?
                        <>
                            <Button
                                variant="secondary"
                                onClick={() => setShowRecipeForm(false)}
                                disabled={isPending}
                            >
                                Přidat obrázek
                            </Button>
                        </> : <>
                            <Button
                                variant="danger"
                                onClick={() => setShowRecipeForm(false)}
                                disabled={isPending}
                            >
                                Smazat obrázek
                            </Button>
                        </>}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="danger"
                        onClick={() => setShowRecipeForm(false)}
                        disabled={isPending}
                    >
                        Smazat
                    </Button>
                    <Button type="submit" variant="primary" disabled={isPending}>
                        {recipe.id ? "Upravit" : "Vytvořit"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

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
