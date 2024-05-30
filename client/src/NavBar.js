import { useNavigate } from "react-router-dom";

import { useContext } from "react";
import { UserContext } from "./UserContext";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

import Icon from "@mdi/react";
import { mdiChefHat, mdiLogout } from "@mdi/js";

function NavBar() {
  const { userList, loggedInUser, handlerMap } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <Navbar expand="lg">
      <Container>
        <Navbar.Brand>
          <button style={{ fontSize: "25px", border: "none", backgroundColor: "white" }} onClick={() => navigate("/")}>
          <Icon path={mdiChefHat} size={1} color={"pink"} />
            RadostVařit
          </button>
        </Navbar.Brand>
        <Nav>
          <NavDropdown
            title={loggedInUser ? loggedInUser.name : "Přihlaš se"}
            drop={"start"}
          >
            {getUserMenuList({ userList, loggedInUser, handlerMap })}
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}

function getUserMenuList({ userList, loggedInUser, handlerMap }) {
  // temporary solution to enable login/logout
  const userMenuItemList = userList.map((user) => (
    <NavDropdown.Item key={user.id} onClick={() => handlerMap.login(user.id)}>
      {user.name}
    </NavDropdown.Item>
  ));

  if (loggedInUser) {
    userMenuItemList.push(<NavDropdown.Divider key={"divider"} />);
    userMenuItemList.push(
      <NavDropdown.Item
        key={"logout"}
        onClick={() => handlerMap.logout()}
        style={{ color: "red" }}
      >
        <Icon path={mdiLogout} size={0.8} color={"red"} /> {"Odhlas se"}
      </NavDropdown.Item>
    );
  }

  return userMenuItemList;
}

export default NavBar;