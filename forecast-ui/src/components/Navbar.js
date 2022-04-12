import React, { useContext } from "react";
import { Navbar, Container} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { GoogleLogout } from "react-google-login";
import { Button } from '@mui/material';
// Import required components.
import { UserContext } from "./Context";

// This function renders navigation bar component.
const NavbarStatic = ({page}) => {
    let navigate = useNavigate();
    const { userAuthDetails, setUser } = useContext(UserContext);
    const navigateTo = (page) => (navigate('/'+page));

    async function onSignoutSuccess() {
        alert("You have been logged out successfully");
        await setUser(null);
    }
    
    return (
        <Navbar bg="light">
            <Container>
                <Navbar.Brand onClick={()=>navigateTo("home")} >
                    <b>Cloud Weather Application</b>
                </Navbar.Brand>
                {userAuthDetails ? (
                <div>
                    <Button variant="contained" hidden={page === "home"} onClick={() => navigateTo("home")} style={{marginRight:"20px"}}>Home</Button>
                    <Button variant="contained" hidden={page === "nexrad" || page === "home"} onClick={() => navigateTo("nexrad")} style={{marginRight:"20px"}}>Nexrad</Button>
                    <Button variant="contained" hidden={page === "merra"  || page === "home"} onClick={() => navigateTo("merra")} style={{marginRight:"20px"}}>Merra</Button>
                    <Button variant="contained" hidden={page === "history" || page === "home"} onClick={() => navigateTo("history")} style={{marginRight:"20px"}}>History</Button>
                    <Button variant="contained" hidden={page === "logs" || page === "home"} onClick={() => navigateTo("logs")} style={{marginRight:"20px"}}>Logs</Button>
                    <GoogleLogout
                    clientId={process.env.REACT_APP_clientId}
                    buttonText="Sign Out"
                    onLogoutSuccess={onSignoutSuccess}
                    variant="outlined-success"
                    />
                </div> 
                ) : null}
            </Container>
        </Navbar>
    );
};

export default NavbarStatic;
