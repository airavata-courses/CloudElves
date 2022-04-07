import React, {useContext, useState} from 'react';
// import {  } from 'react-bootstrap';
import {Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';

// Import required components.
import { UserContext } from './Context';
import Navbar from './Navbar';
import Login from './Login';

// This function is used to fetch user activity by API call to gateway.
const Logs = () => {

	const [logs, setLogs] = useState({"status": 0});
	const { userAuthDetails } = useContext(UserContext);

  	const getLogs = async () => {
        // http://149.165.157.38:30005/getEvents?numItems=5
		const url = `http://${process.env.REACT_APP_gateway_host || "localhost"}:${process.env.REACT_APP_gateway_port || "8082"}/getEvents?numItems=10`;
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
				setLogs({"status": 1, "rows":data});
			})
			.catch((error) => {
				console.log("XXX Error in fetching history records:",error);
				setLogs({"status": -1, "error":"There was a problem in fetching your records, please try again!"});
			}
		);
  	}
	return (
        (userAuthDetails) ?
            <div>
                <Navbar page="logs" />
                <Button variant="contained" onClick={getLogs}>Fetch System Logs</Button>
                {
                    (logs["status"] === 0)? (<div>Please click the button above to fetch system logs.</div>)
                    :(logs["status"] === -1)? (<div>{logs.error}</div>)
                    : (
                        <TableContainer component={Paper} >
                        <Table sx={{ margin:"20px", width: "98%", border: "2px solid black" }} aria-label="simple table">
                            <TableHead>
                            <TableRow >
                                <TableCell align="center" sx={{ width: "22%", border:"1px solid black"}}><b>Log ID</b></TableCell>
                                <TableCell align="center" sx={{ width: "5%", border:"1px solid black"}}><b>User</b></TableCell>
                                <TableCell align="center" sx={{ width: "8%", border:"1px solid black"}}><b>Service ID</b></TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody >
                                {logs["rows"].map((row) => (
                                <TableRow
                                key={row.id}
                                >
                                <TableCell align="left" sx={{ border:"1px solid black"}} >{row.eventId}</TableCell>
                                <TableCell  align="center" sx={{ border:"1px solid black"}} >{row.eventName}</TableCell>
                                <TableCell  align="center" sx={{ border:"1px solid black"}} >{row.eventTimestamp}</TableCell>
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

export default Logs;
