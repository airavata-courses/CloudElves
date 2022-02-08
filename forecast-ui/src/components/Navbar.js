import React, { useContext } from "react";
import { Navbar, Container, Form, Button} from "react-bootstrap";
import { GoogleLogout } from "react-google-login";
// Import required components.
import { UserContext } from "./Context";

// This function renders navigation bar component.
const NavbarStatic = () => {
    const {userAuthDetails, setUser, setPage} = useContext(UserContext);
    console.log(userAuthDetails);

    const onSignoutSuccess = async () => {
        alert("You have been logged out successfully");
        await setUser(null);
    };          

    return (
        <Navbar bg="light">
            <Container>
                <Navbar.Brand onClick={()=>setPage("home")} href="#">
                    <b>Cloud Weather Application</b>
                </Navbar.Brand>
                {userAuthDetails ? (
                <Form className="d-flex">
                    <Button variant="outline-success" onClick={()=>setPage("home")} style={{marginRight:"20px"}}>Home</Button>
                    <Button variant="outline-success" onClick={()=>setPage("history")} style={{marginRight:"20px"}}>History</Button>

                    <GoogleLogout
                    clientId={process.env.REACT_APP_clientId}
                    buttonText="Sign Out"
                    onLogoutSuccess={onSignoutSuccess}
                    variant="outline-success"
                    />
                </Form> 
                ) : null}
            </Container>
        </Navbar>
    );
};

export default NavbarStatic;
