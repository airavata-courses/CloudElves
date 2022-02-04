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
import { UserContextProvider } from "./components/Context";

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate replace to="/home" />} />
                    <Route path="/home" element={<UserContextProvider><Home /></UserContextProvider>} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
