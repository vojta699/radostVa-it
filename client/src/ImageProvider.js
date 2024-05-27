import { useEffect, useState } from "react";
import { ImageContext } from "./ImageContext.js";

function ImageProvider({ children }) {
  const [imageLoadObject, setImageLoadObject] = useState({
    state: "ready",
    error: null,
    data: null,
  });
  const [isPending, setIsPending] = useState(false);
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [base64, setBase64] = useState(null);

  useEffect(() => {
    if (image) {
      fetchImage(image);
    }
  }, [image]);

  const fetchImage = async (imgName) => {
    setIsPending(true);
    try {
      const response = await fetch(`http://localhost:8000/recipe/img/get/${imgName}`);
      const data = await response.text();
      if (response.ok) {
        setBase64(data);
        setImageLoadObject({
          state: "loaded",
          error: null,
          data: data,
        });
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error fetching image:', error);
      setImageLoadObject({
        state: "error",
        error: error.message,
        data: null,
      });
    } finally {
      setIsPending(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    setIsPending(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setImage(data.imageName);
        alert('File uploaded successfully!');
      } else {
        alert('File upload failed!');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file!');
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async () => {
    const deleteUrl = `http://localhost:8000/recipe/img/delete/${image}`;

    setIsPending(true);

    try {
      const response = await fetch(deleteUrl, {
        method: 'DELETE'
      });

      if (response.ok) {
        setImage(null); // Reset the image state
        setFile(null);
        setPreview(null);
        setBase64(null);
        alert('File deleted successfully!');
      } else {
        alert('File deletion failed!');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Error deleting file!');
    } finally {
      setIsPending(false);
    }
  };

  const value = {
    state: imageLoadObject.state,
    imageList: imageLoadObject.data || [],
    handlerMap: { fetchImage, handleSubmit, handleDelete },
    isPending,
    file,
    setFile,
    preview,
    setPreview,
    base64,
    setBase64,
    image,
    setImage,
  };

  return (
    <ImageContext.Provider value={value}>
      {children}
    </ImageContext.Provider>
  );
}


export default ImageProvider;