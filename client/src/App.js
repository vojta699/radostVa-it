import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./Layout";
import Dashboard from "./Dashboard";
import UserProvider from "./UserProvider";
import RecipeListProvider from "./RecipeListProvider";

function App() {
  return (
    <div style={componentStyle()}>
      <UserProvider>
        <RecipeListProvider>
        <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                {/* <Route path="eventDetail" element={}/> */}
                <Route path="*" element={"not found"} />
              </Route>
            </Routes>
          </BrowserRouter>
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