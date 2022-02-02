// Import required libraries.
import React, { useContext } from "react";
// Import required components.
import Login from "./Login";
import Dashboard from "./Dashboard";
import History from "./History";
import Navbar from "./Navbar";
import { UserContext } from "./Context";

const Home = () => {
    const renderSwitch= {"home": <Dashboard />, "history":<History/>}
    
    const { userAuthDetails, currPage } = useContext(UserContext);
    // console.log("User value:", user);
    return (
    
            <div className="home-page">

                <Navbar /> 
                {userAuthDetails ? renderSwitch[currPage] : <Login />}
            </div>
      
    );
};

export default Home;
