import React, { useContext, useEffect } from "react";
import { StateContext, UserContext } from "./Context";

// Import required components.
import Input from "./Input";
import Plot from "./Plot";
import Navbar from "./Navbar";
import Login from "./Login";


function NexradDashboard() {

    const { state, setState } = useContext(StateContext);
    const { userAuthDetails } = useContext(UserContext);
    const sleep = (ms) => (new Promise(resolve => setTimeout(resolve, ms)));

    useEffect(() => {
        console.log("Nexrad Effect:",state);
        if (state["loading"] && state["status_id"] && !state["status_img"])
            getS3Key(state["id"]);     
        
    },[state]);

    async function inputProcessor(userInputs) {
        console.log("Sending request");
        // console.log("Loading:",state["loading"]);
        await getId(userInputs);
        return;
    }

    async function getId(data) {
        const url = `http://${process.env.REACT_APP_gateway_host || "localhost"}:${process.env.REACT_APP_gateway_port || "8082"}/nexrad/data`;
        const response = await fetch(url,
                        {   method: "POST",
                            headers: {
                                "id_token": userAuthDetails.id_token,
                                "name": userAuthDetails.name,
                                "email": userAuthDetails.email,
                                'Content-Type':'application/json',
                            },
                            body: JSON.stringify(data),
                        }).then(response => (response.json()))
                        .then(response =>{
                            if (response["error"]) return {"status_id": -1, "error":response["error"]};
                            else return {"status_id":1, "id":response["id"]};})
                        .catch(error => ({"status_id":-1,"error":error}));

        if (response["status_id"] === -1){
            console.log("XXX ERROR");
            setState({...state,...response,"status_img":0});
        }
        else{
            console.log("--> Request Complete");
            setState({...state, ...response,"status_img":0,"loading":true});
        }
        return;
    }
    
    async function getS3Key(id) {
        console.log("ooo Fetching S3key for id:",id);
        let counter = 20;
        let url = `http://${process.env.REACT_APP_gateway_host || "localhost"}:${process.env.REACT_APP_gateway_port || "8082"}/status?id=${id}`;
        while (counter--){
            const response = await fetch(url,
                        {   method: "GET",
                            headers: {
                                "id_token": userAuthDetails.id_token,
                                "name": userAuthDetails.name,
                                "email": userAuthDetails.email,
                                'Content-Type':'application/json',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Headers': 'Content-Type',
                            },
                        })
                        .then(response => {return response.json()})
                        .then(response => ({"status_img":response["status"] == null? -1: response["status"], "resultS3Key":response["resultS3Key"], "error":response["comments"]}))
                        .catch(error => ({"status_img": -1, "resultS3Key":"","error":error}));

            if (response["status_img"] === 1){
                console.log("--> SUCCESS S3Key");
                const img_url = await getImage(response, id);
                setState({...state,...response,"img_url": img_url, "loading":false});
                break;
            }
            else if (response["status_img" === -1]){
                console.log("XXX ERROR S3Key");
                setState({...state,...response, "img_url":"", "loading":false});
                break;
            }
            else{
                console.log("Counter:",counter);
                if (counter>0){
                    await sleep(1500);
                    console.log("Still loading...");
                }
                else{
                    console.log("XXX ERROR S3Key");
                    setState({...state,...response, "status_img": -1, "img_url":"", "loading":false});
                    break;
                }
            }
        }
        return;
    }

    async function getImage (response) {
        console.log("ooo Fetching image for S3key:", response["resultS3Key"]);
        let url = `http://${process.env.REACT_APP_gateway_host || "localhost"}:${process.env.REACT_APP_gateway_port || "8082"}/image?id=${response["resultS3Key"]}`;
        let img_url_response = await fetch( url,
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
        return img_url_response["image"];
    }
    
    return (
        <div className="nexrad">
            {userAuthDetails ?
                <div>
                    <Navbar page="nexrad"/>
                    <Input inputCollector={inputProcessor}/>
                    <Plot />
                </div>
            : <Login />}
        </div>
    )
};

export default NexradDashboard;
