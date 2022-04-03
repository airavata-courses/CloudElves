import React, {useContext, useState} from 'react';
// import {  } from 'react-bootstrap';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';

// Import required components.
import { UserContext } from './Context';
import Navbar from './Navbar';
import Login from './Login';

// This function is used to fetch user activity by API call to gateway.
const History = () => {

	const [logs, setLogs] = useState({"status": 0});
	const { userAuthDetails } = useContext(UserContext);

  	async function getLogs() {
		const url = `http://${process.env.REACT_APP_gateway_host || "localhost"}:${process.env.REACT_APP_gateway_port || "8082"}/getLogs`;
		await fetch(url, {
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
				console.log("--> user history retrieved!");
				setLogs({ "status": 1, "rows": data });
			})
			.catch((error) => {
				console.log("XXX Error in fetching history records:", error);
				setLogs({ "status": -1, "error": "There was a problem in fetching your records, please try again!" });
			}
			);
	}
	
	return (	
		(userAuthDetails) ? 
			<div>
				<Navbar page="history" />
				<Button variant="contained" onClick={getLogs}>Search History</Button>
				{
					(logs["status"] === 0) ? <div>Please click the button above to fetch your previous searches.</div>
					: (logs["status"] === -1) ? <div>{logs.error}</div>
					: (
						<TableContainer component={Paper} >
						<Table sx={{ margin:"20px", width: "98%", border: "2px solid black" }} aria-label="simple table">
							<TableHead>
							<TableRow >
								<TableCell align="center" sx={{ width: "22%", border:"1px solid black"}}><b>Log ID</b></TableCell>
								<TableCell align="center" sx={{ width: "5%", border:"1px solid black"}}><b>User</b></TableCell>
								<TableCell align="center" sx={{ width: "8%", border:"1px solid black"}}><b>Service ID</b></TableCell>
								<TableCell align="center" sx={{ width: "8%", border:"1px solid black"}}><b>Action</b></TableCell>
								<TableCell align="center" sx={{ width: "10%", border:"1px solid black"}}><b>Timestamp</b></TableCell>
								<TableCell align="center" sx={{ width: "32%", border:"1px solid black"}}><b>Comments</b></TableCell>
								<TableCell align="center" sx={{ width: "5%", border:"1px solid black"}}><b>Status</b></TableCell>
							</TableRow>
							</TableHead>
							<TableBody >
								{logs["rows"].map((row) => (
								<TableRow
								key={row.id}
								>
								<TableCell align="left" sx={{ border:"1px solid black"}} >{row.id}</TableCell>
								<TableCell  align="center" sx={{ border:"1px solid black"}} >{row.userId}</TableCell>
								<TableCell  align="center" sx={{ border:"1px solid black"}} >{row.serviceId}</TableCell>
								<TableCell  align="center" sx={{ border:"1px solid black"}} >{row.action}</TableCell>
								<TableCell  align="center" sx={{ border:"1px solid black"}} >{row.timestamp}</TableCell>
								<TableCell sx={{ border:"1px solid black"}} >{row.comments}</TableCell>
								<TableCell  align="center" sx={{ border:"1px solid black"}} >{row.status}</TableCell>
								</TableRow>
								))}
							</TableBody>
							</Table>
					</TableContainer>
					)
				}
		  	</div>
		: <Login />
	)
};

export default History;
