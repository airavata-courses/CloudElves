import React, { useContext } from "react";
import { Navbar, Container } from "react-bootstrap";
import { GoogleLogout } from "react-google-login";
import { UserContext } from "./Context";

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
                <Navbar.Brand onClick={()=>setPage("home")}>
                    Cloud Weather Application
                </Navbar.Brand>
                {userAuthDetails ? (
                    <div>
                        <button  onClick={()=>setPage("history")}>History</button>
                        <GoogleLogout
                        clientId={process.env.REACT_APP_clientId}
                        buttonText="Sign Out"
                        onLogoutSuccess={onSignoutSuccess}
                        />
                    </div> 
                ) : null}
            </Container>
        </Navbar>
    );
};

export default NavbarStatic;
