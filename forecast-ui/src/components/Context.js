// import { create } from "@mui/material/styles/createTransitions";
import React, { createContext, useState } from "react";

export const UserContext = createContext(); // Create context for user session management.
export const StateContext = createContext(); // Create context for user state management.

// Context Provider function - Wrap this around the component you want to access the context in.
export const UserContextProvider = ({children}) => {
	
	const [userAuthDetails, setUser] = useState("");
	const [currPage, setPage] = useState("home");
	
	return (
		<UserContext.Provider value={{userAuthDetails, setUser, currPage, setPage}}>
      		{children}
    	</UserContext.Provider>
	);
}

export const SessionContextProvider = ({children}) => {
	
	const [state, setState] = useState({"loading":false, "status_id":0, "id":"", "status_img":0, "img":""});

	return (
		<StateContext.Provider value={{state, setState}}>
      		{children}
    	</StateContext.Provider>
	);
}
