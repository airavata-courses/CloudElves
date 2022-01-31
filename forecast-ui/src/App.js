import "./App.css";
import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
// Import required components.
import Home from "./components/Home";
import Login from "./components/Login";
import UserActivity from "./components/UserAc";

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate replace to="/home" />} />
                    <Route path="/home/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
					<Route path="/history" element={<UserActivity />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
