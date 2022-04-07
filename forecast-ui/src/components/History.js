import React, {useContext, useState} from 'react';
// import {  } from 'react-bootstrap';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';

// Import required components.
import { UserContext } from './Context';
import Navbar from './Navbar';
import Login from './Login';

// This function is used to fetch user activity by API call to gateway.
const History = () => {

	const [history, setHistory] = useState({"status": 0});
	const { userAuthDetails } = useContext(UserContext);

  	async function getHistory() {
		const url = `http://${process.env.REACT_APP_gateway_host || "localhost"}:${process.env.REACT_APP_gateway_port || "8082"}/history`;
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
				setHistory({ "status": 1, "rows": data });
			})
			.catch((error) => {
				console.log("XXX Error in fetching history records:", error);
				setHistory({ "status": -1, "error": "There was a problem in fetching your records, please try again!" });
			}
			);
	}
	
	return (	
		(userAuthDetails) ? 
			<div>
				<Navbar page="history" />
				<Button variant="contained" onClick={getHistory}>Search History</Button>
				{
					(history["status"] === 0) ? <div>Please click the button above to fetch your previous searches.</div>
					: (history["status"] === -1) ? <div>{history.error}</div>
					: (
						<TableContainer component={Paper} >
						<Table sx={{ margin:"20px", width: "98%", border: "2px solid black" }} aria-label="simple table">
							<TableHead>
							<TableRow >
								<TableCell align="center" sx={{ width: "22%", border:"1px solid black"}}><b>Search ID</b></TableCell>
								<TableCell align="center" sx={{ width: "8%", border:"1px solid black"}}><b>Source</b></TableCell>
								<TableCell align="center" sx={{ width: "8%", border:"1px solid black"}}><b>Status</b></TableCell>
								<TableCell align="center" sx={{ width: "32%", border:"1px solid black"}}><b>Image</b></TableCell>
								<TableCell align="center" sx={{ width: "5%", border:"1px solid black"}}><b>Comments</b></TableCell>
								<TableCell align="center" sx={{ width: "10%", border:"1px solid black"}}><b>Timestamp</b></TableCell>
							</TableRow>
							</TableHead>
							<TableBody >
								{history["rows"].map((row) => (
								<TableRow
								key={row.id}
								>
								<TableCell align="left" sx={{ border:"1px solid black"}} >{row.requestId}</TableCell>
								<TableCell  align="center" sx={{ border:"1px solid black"}} >{row.dataSource}</TableCell>
								<TableCell  align="center" sx={{ border:"1px solid black"}} >{row.status}</TableCell>
								<TableCell  align="center" sx={{ border:"1px solid black"}} >{row.resultS3Key}</TableCell>
								<TableCell align='center' sx={{ border:"1px solid black"}} >{row.comments}</TableCell>
								<TableCell  align="center" sx={{ border:"1px solid black"}} >{row.timestamp}</TableCell>
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
