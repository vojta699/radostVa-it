import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./Layout";
import Dashboard from "./Dashboard";
import UserProvider from "./UserProvider";
import RecipeListProvider from "./RecipeListProvider";
import RecipeRoute from "./RecipeRoute";
import RecipeProvider from "./RecipeProvider";
import ImageProvider from "./ImageProvider";

function App() {
  return (
    <div style={componentStyle()}>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route
                index
                element={
                  <RecipeListProvider>
                    <ImageProvider>
                      <Dashboard />
                    </ImageProvider>
                  </RecipeListProvider>
                }
              />
              <Route
                path="recipeDetail"
                element={
                  <RecipeProvider>
                    <ImageProvider>
                      <RecipeRoute />
                    </ImageProvider>
                  </RecipeProvider>}
              />
              <Route path="*" element={"not found"} />
            </Route>
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </div>
  );
}

function componentStyle() {
  return {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    backgroundColor: "white",
  };
}

export default App;