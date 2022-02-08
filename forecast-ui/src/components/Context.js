import React, { createContext, useState } from "react";

export const UserContext = createContext(); // Create context for user session management.

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
