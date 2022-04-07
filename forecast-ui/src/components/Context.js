// import { create } from "@mui/material/styles/createTransitions";
import React, { createContext, useState } from "react";
// import { useGoogleLogin } from 'react-google-login'

export const UserContext = createContext(); // Create context for user session management.
export const StateContext = createContext(); // Create context for user state management.
export const MerraContext = createContext(); // Create context for merra state managment.

// Context Provider function - Wrap these around the component you want to access the context in.
export const UserContextProvider = ({ children }) => {
	
	const [userAuthDetails, setUser] = useState("");
	
	return (
		<UserContext.Provider value={{ userAuthDetails, setUser }}>
      		{children}
    	</UserContext.Provider>
	);
}

export const SessionContextProvider = ({ children }) => {
	
	const [state, setState] = useState({"loading":false, "status_id":0, "id":"", "status_img":0, "resultS3Key":""});

	return (
		<StateContext.Provider value={{ state, setState }}>
      		{children}
    	</StateContext.Provider>
	);
}

export const MerraContextProvider = ({ children }) => {
	
	const [state, setState] = useState({"loading":false, "status_id":0, "status_img":{}});

	return (
		<MerraContext.Provider value={{ state, setState }}>
      		{children}
    	</MerraContext.Provider>
	);
}
