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
        <RecipeListProvider>
        <ImageProvider>
        <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="recipeDetail" element={<RecipeProvider>
                      <RecipeRoute />
                    </RecipeProvider>}/>
                <Route path="*" element={"not found"} />
              </Route>
            </Routes>
          </BrowserRouter>
          </ImageProvider>
          </RecipeListProvider>
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