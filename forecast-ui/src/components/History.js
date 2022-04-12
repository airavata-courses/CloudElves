import React, {useContext, useState, useEffect} from 'react';
// import {  } from 'react-bootstrap';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';

// Import required components.
import { UserContext } from './Context';
import Navbar from './Navbar';
import Login from './Login';

// This function is used to fetch user activity by API call to gateway.
const History = () => {

	const [history, setHistory] = useState({"status": 0});
	const [image, setImage] = useState("");
	const { userAuthDetails } = useContext(UserContext);
	useEffect(() => {
	  
	}, [image])
	
  	async function getHistory() {
		const url = `http://${process.env.REACT_APP_gateway_host || "localhost"}:${process.env.REACT_APP_gateway_port || "8082"}/history`;
		const response = await fetch(url, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"id_token": userAuthDetails.id_token,
					"name": userAuthDetails.name,
					"email": userAuthDetails.email
				}
			}).then((response) => response.json())
			.then((response) => ({ "status": 1, "rows": response }))
			.catch((error) => ({ "status": -1, "error": error }));
		if (response["status"] === -1) {
			console.log("XXX Error in fetching history records:", response["error"]);
			setHistory(response);
		}
		else {
			const rows = await getImage(response["rows"]);
			console.log(rows);
			setHistory({ "status": 1, "rows": rows });
		}
	}

	async function getImage(records) {
		console.log(records)
		const url = `http://${process.env.REACT_APP_gateway_host || "localhost"}:${process.env.REACT_APP_gateway_port || "8082"}/image?id=`;
		for (let i = 0; i < records.length; i++) {
			if (records[i]["resultS3Key"]){
				console.log("Fetching image for:", records[i]["resultS3Key"]);
				let img_url_response = await fetch( url+records[i]["resultS3Key"],
                                {   method: "GET",
                                    headers: {
                                        "id_token": userAuthDetails.id_token,
                                        "name": userAuthDetails.name,
                                        "email": userAuthDetails.email,
                                        'Content-Type':'application/json',
                                        'Access-Control-Allow-Origin': '*',
                                        'Access-Control-Allow-Headers': 'Content-Type',
                                    }
                                }).then(response => response.json())
                                    .then(response => (response))
                                    .catch(error => (error));
                
				if (img_url_response["image"]) {
					console.log("img_url_response recv");
					records[i]["img_url"] = img_url_response["image"];
				}
                else{
					console.log("error");
                    records[i]["img_url"] = "";
                }
			}
		}
		return records;
	}
	
	return (	
		(userAuthDetails) ? 
			<div>
				<Navbar page="history" />
				<Button variant="contained" onClick={getHistory}>Search History</Button>
				{
					(history["status"] === 0) ? <div style={{height: "45vh"}}>Please click the button above to fetch your previous searches.</div>
					: (history["status"] === -1) ? <div style={{ height: "45vh"}}>There was a problem in fetching your records, please try again!</div>
					: (
						<TableContainer component={Paper} style={{ height: "45vh"}}>
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
								<TableCell  align="center" sx={{ border:"1px solid black"}} >
									{row.img_url ?
										<Button variant="contained" onClick={() => setImage(image)}>View Image</Button>
										: <div>Nan</div>
									}
								</TableCell>
								<TableCell align='center' sx={{ border:"1px solid black"}} >{row.comments}</TableCell>
								<TableCell  align="center" sx={{ border:"1px solid black"}} >{row.timestamp}</TableCell>
								</TableRow>
								))}
							</TableBody>
							</Table>
					</TableContainer>
					)
				}
				{
					image &&  <img
					className="image"
					style={{ width:"80%" }}
					src={`data:image/png;base64, ${image}`}
					alt="no image"
					/>
				}

		  	</div>
		: <Login />
	)
};

export default History;
