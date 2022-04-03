// Import required libraries.
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
// import {Button} from "react-bootstrap";
import { Button } from '@mui/material';
// Import required components.
import Login from "./Login";
import Navbar from "./Navbar";
import { UserContext } from "./Context";

// This component is the entry point for navigation to other pages.
const Home = () => {
    let navigate = useNavigate();
    const { userAuthDetails } = useContext(UserContext);

    const navigateTo = (page) => {
        console.log('Page: /'+page);
        navigate('/'+page);
        return;
    }
    return (
        <div className="home">
            <Navbar page = "home"/>
            {userAuthDetails ?
                <div>
                    <Button variant="contained" onClick={()=>navigateTo("nexrad")} style={{margin:"20px"}}>Nexrad</Button>
                    <Button variant="contained" onClick={()=>navigateTo("merra")} style={{margin:"20px"}}>Merra</Button>
                    <Button variant="contained" onClick={()=>navigateTo("history")} style={{margin:"20px"}}>History</Button>
                    <Button variant="contained" onClick={()=>navigateTo("logs")} style={{margin:"20px"}}>Logs</Button>
                </div>
            : <Login />}
        </div>
    );
};

export default Home;
