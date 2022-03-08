import React, {useContext, useState} from 'react';
import { Button } from 'react-bootstrap';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';

// Import required components.
import { UserContext } from './Context';

// This function is used to fetch user activity by API call to gateway.
const History = () => {

	const [logs, setLogs] = useState(null);
	const { userAuthDetails } = useContext(UserContext);

  	const getLogs = async () => {
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
				console.log("--> user logs retrieved!");
				setLogs({"success":data});
			})
			.catch((error) => {
				console.log("XXX Error in fetching logs:",error);
				setLogs({"error":"There was a problem in fetching your logs, please try again!"});
			}
		);
  	}
	
	if (!logs){
		return (
			<div>
				<Button variant="outline-success" onClick={getLogs} style={{margin:"20px"}}>Get User Logs</Button>
				<div>Please click the button above to fetch your log records.</div>
			</div>
		)
	}
	else if (logs.error){
		return (
		<div>
			<Button variant="outline-success" onClick={getLogs} style={{margin:"20px"}}>Get User Logs</Button>
			<div>{logs.error}</div>
		</div>)
	}
	else if (logs.success){
		let rows = logs.success;
		return (
			<div>
				<Button variant="outline-success" onClick={getLogs} style={{margin:"20px"}}>Get User Logs</Button>

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
							{rows.map((row) => (
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
		</div>
		);
	}
};

export default History;
