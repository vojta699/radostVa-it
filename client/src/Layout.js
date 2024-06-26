import { Outlet } from "react-router-dom";

import NavBar from "./NavBar";

const Layout = () => {
  return (
    <>
      <div className="card-header">
        <NavBar />
      </div>
      <div style={bodyStyle()}>
        <Outlet />
      </div>
      <div className={"card-footer text-dark"} style={footerStyle()}>
        © Vojtěch Vihan
      </div>
    </>
  );
};

function bodyStyle() {
  return {
    overflow: "auto",
    padding: "16px",
    flex: "1",
    borderTop: "#DEE2E6 4px solid",
    borderBottom: "#DEE2E6 4px solid",
  };
}

function footerStyle() {
  return { padding: "8px", textAlign: "center", fontSize:"15px" };
}

export default Layout;