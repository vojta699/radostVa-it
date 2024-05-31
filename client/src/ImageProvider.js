import { useEffect, useState, useContext } from "react";
import { ImageContext } from "./ImageContext.js";
import { RecipeListContext } from "./RecipeListContext.js";

function ImageProvider({ children }) {
  const [imageLoadObject, setImageLoadObject] = useState({
    state: "ready",
    error: null,
    data: null,
  });
  const [base64, setBase64] = useState(null);
  const [newImage, setNewImage] = useState(null)

  async function fetchImage(imageName) {
    try {
      const response = await fetch(`http://localhost:8000/recipe/img/get/${imageName}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.text();
      setBase64(data);
      return data;
    } catch (error) {
      console.error('Error fetching image:', error);
      throw error;
    }
  }

  async function handleSubmitImg(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/recipe/img/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setNewImage(data.filename);
        console.log('File uploaded successfully!');
        return data.filename; // Vrátí název nového obrázku
      } else {
        console.log('File upload failed!');
        return null;
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };

  async function handleDeleteImg(imageToDelete) {
    const deleteUrl = `http://localhost:8000/recipe/img/delete/${imageToDelete}`;
    try {
      const response = await fetch(deleteUrl, {
        method: 'POST'
      });
      if (response.ok) {
        console.log('File deleted successfully!');
      } else {
        console.log('File deletion failed!');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const value = {
    state: imageLoadObject.state,
    imageList: imageLoadObject.data || [],
    ImagehandlerMap: { fetchImage, handleSubmitImg, handleDeleteImg },
    base64,
    newImage
  };

  return (
    <ImageContext.Provider value={value}>
      {children}
    </ImageContext.Provider>
  );
}


export default ImageProvider;