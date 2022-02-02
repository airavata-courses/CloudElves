import React, { createContext, useState } from "react";

export const UserContext = createContext(); // Create context for user session management.
// const UserSetContext = createContext();

// export const userContext = () => {
//   return useContext(UserContext)
// }
// export const userSetContext = () => {
//   return useContext(UserSetContext)
// }
export const UserContextProvider = ({children}) => {
	const [userAuthDetails, setUser] = useState("");
  const [currPage, setPage] = useState("home");
  return (<UserContext.Provider value={{userAuthDetails, setUser, currPage, setPage}}>
      {children}
    </UserContext.Provider>);
}