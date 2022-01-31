// Import required libraries.
import React, { useState, createContext } from "react";
// Import required components.
import Login from "./Login";
import Dashboard from "./Dashboard";
import Navbar from "./Navbar";

export const UserContext = createContext(null); // Create context for user session management.

const Home = () => {
    const [user, setUser] = useState("");
    // console.log("User value:", user);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            <div className="home-page">
                <Navbar /> {/* Navbar component */}
                {user ? <Dashboard /> : <Login />}
            </div>
        </UserContext.Provider>
    );
};

export default Home;
