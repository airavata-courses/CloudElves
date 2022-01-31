import React, { useContext } from "react";
import { Navbar, Container } from "react-bootstrap";
import { GoogleLogout } from "react-google-login";
import { UserContext } from "./Home";

const NavbarStatic = () => {
    const { user, setUser } = useContext(UserContext);

    const onSignoutSuccess = async () => {
        alert("You have been logged out successfully");
        await setUser(null);
    };          

    return (
        <Navbar bg="light">
            <Container>
                <Navbar.Brand href="/login">
                    Cloud Weather Application
                </Navbar.Brand>
                {user ? (
                    <div>
                        <a href="/history">History</a>
                    <GoogleLogout
                    clientId={process.env.REACT_APP_clientId}
                    buttonText="Sign Out"
                    onLogoutSuccess={onSignoutSuccess}
                ></GoogleLogout></div>
                    
                ) : null}
            </Container>
        </Navbar>
    );
};

export default NavbarStatic;
