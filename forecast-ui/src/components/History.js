import React, {useContext, useState} from 'react';
import { Button } from 'react-bootstrap';
import {UserContext} from './Context';

// This function is used to fetch user activity by API call to gateway.
const History = () => {
	const [logs, setLogs] = useState(null);
	const {userAuthDetails} = useContext(UserContext);

  	const getLogs = async () => {
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
				console.log(data);
				setLogs({"success":data});
			})
			.catch((error) => {
				setLogs({"error":error});
			}
		);
  	}
	
	if (!logs){
		return <Button variant="outline-success" onClick={getLogs} style={{marginRight:"20px"}}>Fetch</Button>
	}
	else if (logs.error){
		return (
		<div>
			<Button variant="outline-success" onClick={getLogs} style={{marginRight:"20px"}}>Fetch</Button>
			<div>There was some error in fetching data, please try again.</div>
		</div>)
	}
	else if (logs.success){
		let list = logs.success;
		return (
		<div>
		<table style={{'border': '3px solid black'}}>
			<tr key={"header"}>
				{Object.keys(list[0]).map((key) => ( <th>{key}</th>	))}
			</tr>
			{list.map((item) => (
				<tr key={item.id}>
				{Object.values(item).map((val) => (	<td>{val}</td>	))}
				</tr>
			))}
    	</table>
		<Button variant="outline-success" onClick={getLogs} style={{marginRight:"20px"}}>Fetch</Button>
		</div>
		);
	}
};

export default History;