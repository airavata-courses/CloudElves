
import React, {useContext, useState} from 'react';
import {UserContext} from './Context';

const History = () => {
  const numbers = ['TPHX', 'TPIT', 'TRDU', 'TSDF', 'TSLC', 'TSTL', 'TTPA', 'TTUL'];
  const [dummy, setDummy] = useState([]);
  const listItems = numbers.map((number) => <li>{number}</li>);
  const {userAuthDetails} = useContext(UserContext);
  const url = `http://localhost:8082/getLogs?userId=${userAuthDetails["name"]}`;

  const getDummy = async () => {
    await fetch('http://localhost:8082/getLogs', {
		method: "GET",
			headers: {
				"Content-Type": "application/json",
				"id_token": userAuthDetails.id_token,
				"name": userAuthDetails.name,
				"email": userAuthDetails.email
			}
			})
		.then((response) => response.json())
		.then((data) => {
			console.log("Success:", data);
			setDummy(data);
		})
		.catch((error) => {
			console.error("Error:", error);
		}
	);
  }
//   console.log(userAuthDetails);
//   console.log(url);
//   getDummy(url);
//   console.log(dummy);
return(
  <div>
    Table here
	<div onClick={getDummy}>Fetch</div> 
    {/* <ul>{listItems}</ul> */}
  </div>
);

}

export default History;