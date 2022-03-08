// Import required libraries.
import React, { useContext } from "react";
// Import required components.
import Login from "./Login";
import Dashboard from "./Dashboard";
import History from "./History";
import Navbar from "./Navbar";
import { UserContext, SessionContextProvider } from "./Context";

// This is the home component where all the children components are rendered.
const Home = () => {
    
    const renderSwitch= {"home":<SessionContextProvider><Dashboard /></SessionContextProvider> , "history":<History/>}
    const { userAuthDetails, currPage } = useContext(UserContext);

    return (
        <div className="home-page">
            <Navbar /> 
            {userAuthDetails ? renderSwitch[currPage] : <Login />}
        </div>
    );
};

export default Home;
