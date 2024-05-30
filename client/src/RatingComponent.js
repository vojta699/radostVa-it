import React, { useEffect, useState, useContext, useCallback } from 'react';
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { AiOutlineStar } from "react-icons/ai";
import { UserContext } from './UserContext';
import { Modal, Button } from 'react-bootstrap';

const RatingComponent = ({ recipeId }) => {
  const { loggedInUser } = useContext(UserContext);
  const [averageRating, setAverageRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingID, setRatingID] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [updateRatingValue, setUpdateRatingValue] = useState()

  // Vytvoření elementu reprezentující hodnocení pomocí icon hvězd
  const getStars = (rating) => {
    const stars = [];
    let fullStars = Math.floor(rating);
    let halfStar = rating % 1 !== 0;
    let emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar style={styleOfStart()} key={i} />);
    }
    if (halfStar) {
      stars.push(<FaStarHalfAlt style={styleOfStart()} key={'half'} />);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<AiOutlineStar style={styleOfStart()} key={i + fullStars + (halfStar ? 1 : 0)} />);
    }
    return stars;
  };


  // Fetch průměrného hodnocení z API
  const fetchRatings = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8000/recipe/avgRating/${recipeId}`);
      const data = await response.json();
      setAverageRating(data.avgRating.toFixed(2));
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  }, [recipeId])

  // POST API - CREATE
  const handleRatingChange = async (newRating) => {
    try {
      const response = await fetch(`http://localhost:8000/rating/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating: newRating, recipe_ID: recipeId, user_ID: loggedInUser.id }),
      });
      if (response.status < 300) {
        await response.json();
        await fetchRatings()
      } else if (response.status === 300) {
        const ratingExist = await response.json();
        if (ratingExist.code === "ratingAlreadyExists") {
          if (ratingExist.existingRatingId) {
            setShowConfirmation(true)
            setRatingID(ratingExist.existingRatingId)
          }
        } else {
          console.error('Error submitting rating:', response.statusText);
        }
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  }
  // POST API - UPDATE
  const handleRatingUpdate = async (newRating) => {
    try {
      const response = await fetch(`http://localhost:8000/rating/update/${ratingID}/${loggedInUser.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating: newRating }),
      });
      if (response.status < 400) {
        await response.json();
        await fetchRatings()

      } else if (response.status === 400) {
        console.error('Error submitting rating:', response.statusText)
      }
    }
    catch (error) {
      console.error('Error submitting rating:', error);
    }
  }
  // Funkce spouštějící Update přes formulář
  const handleUpdateConfirmation = async (rating) => {
    await handleRatingUpdate(rating);
    setShowConfirmation(false);
  };
  // Funkce definující hodnotu nového hodnocení pro Update
  function updateRating(newRating) {
    if (newRating >= 1 && newRating <= 5) {
      setUpdateRatingValue(newRating); // Nastav nové hodnocení
    }
  }

  useEffect(() => {
    fetchRatings ();
  }, [recipeId, loggedInUser, fetchRatings]);

  return (
    <div>
      {!loggedInUser && (
        <div>
          {getStars(averageRating).map((star, index) => (
            <span key={index}>
              {star}
            </span>
          ))}
          {averageRating}
        </div>
      )}
      {loggedInUser && (
        <div>
          {getStars(hoverRating || averageRating).map((star, index) => (
            <span
              key={index}
              style={{ cursor: 'pointer' }}
              onClick={() => handleRatingChange(index + 1)}
              onMouseEnter={() => { setHoverRating(index + 1); updateRating(index + 1) }}
              onMouseLeave={() => setHoverRating(0)}
            >
              {star}
            </span>
          ))}
          {averageRating}
        </div>
      )}
      <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Potvrzení</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Vaše hodnocení pro tento recept již existuje. Přejete si jej aktualizovat?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmation(false)}>
            Zrušit
          </Button>
          <Button variant="primary" onClick={(index) => handleUpdateConfirmation(updateRatingValue)}>
            Aktualizovat
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

function styleOfStart() {
  return {
    color: "gold",
    borderSize: "1px",
    borderColor: "black"
  };
}

export default RatingComponent;