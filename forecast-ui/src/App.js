import "./App.css";
import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

// Import required components.
import { UserContextProvider, SessionContextProvider, MerraContextProvider } from "./components/Context";
import Home from "./components/Home";
import NexradDashboard from "./components/Nexrad";
import MerraDashboard from "./components/Merra";
import History from "./components/History";
import Logs from "./components/Logs";

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate replace to="/home" />} />
                    <Route path="/home" element={<UserContextProvider><Home /></UserContextProvider>} />
                    <Route path="/nexrad" element={<UserContextProvider><SessionContextProvider><NexradDashboard /></SessionContextProvider></UserContextProvider>} />
                    <Route path="/merra" element={<UserContextProvider><MerraContextProvider><MerraDashboard /></MerraContextProvider></UserContextProvider>} />
                    <Route path="/history" element={<UserContextProvider><History /></UserContextProvider>} />
                    <Route path="/logs" element={<UserContextProvider><Logs /></UserContextProvider>} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
