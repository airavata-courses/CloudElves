import React, { useState, useContext, useEffect } from "react";
import { MerraContext, UserContext } from "./Context";

// Import required components.
import {defaultParams} from "./constants";
import Navbar from "./Navbar";
import Login from "./Login";
import MerraInput from "./MerraInput";
import MerraPlot from "./MerraPlot";

function MerraDashboard () {

    const { userAuthDetails } = useContext(UserContext);
    const { state, setState }  = useContext(MerraContext);
    // const [params, setParams] = useState(defaultParams);
    const params = defaultParams;
    const sleep = (ms) => (new Promise(resolve => setTimeout(resolve, ms)));

    // useEffect(() => {
    //     console.log("In Effect: Init");
    //     if (userAuthDetails) fetchParameters();
    // }, [userAuthDetails]);

    useEffect(() => {
        console.log("State changed:", state);
        if (state["loading"] && state["status_id"] && Object.keys(state["status_img"]).length > 0) getS3keys(state["status_img"]);

    }, [state]);

    // async function fetchParameters() {
    //     const url = `http://${process.env.REACT_APP_gateway_host || "localhost"}:${process.env.REACT_APP_gateway_port || "8082"}/merra/config`;
    //     const response = await fetch(url, {
    //         method: "GET",
    //         headers: {
    //             "id_token": userAuthDetails.id_token,
    //             "name": userAuthDetails.name,
    //             "email": userAuthDetails.email,
    //             'Access-Control-Allow-Origin': '*',
    //             'Access-Control-Allow-Headers': 'Content-Type',
    //         },
    //     }).then(response => response.json())
    //         .then(response => ({ "status": 1, "params": response }))
    //         .catch(error => {
    //             console.log("XXX Error!");
    //             return { "status": -1, "comments": error };
    //         });
    //     if (response["status"] === 1)
    //         setParams(response["params"]);
    // }

    async function inputProcessor (userInputs) {
        // console.log("Loading:", state["loading"]);
        console.log("userInputs", userInputs);

        await getId(userInputs);
        return;
    }

    async function getId(data) {
        console.log(JSON.stringify(data));
        const url = `http://${process.env.REACT_APP_gateway_host || "localhost"}:${process.env.REACT_APP_gateway_port || "8082"}/mera/data`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "id_token": userAuthDetails.id_token,
                "name": userAuthDetails.name,
                "email": userAuthDetails.email,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Content-Type':'application/json',
            },
            body: JSON.stringify(data),
        }).then(response => (response.json()))
            .then(response => {
                if (response["error"]) return {"status_id":-1, "error":response["error"]}
                else return {"status_id":1, "id_list":response["id"]}})
            .catch( error => ({"status_id":-1, "error":error}));

        if (response["status_id"] === -1){
            console.log("XXX ERROR in fetching UUID:",response);
            setState({...state,...response, "status_img":{}});
        }
        else{
            /*  Example JSON Response
                {   "status_id": 1,
                    "id_list": {
                        "t1":"123-asd",
                        "t2": "234-sdf",
                        "t3": "345-dfg"
                    }
                } 
            */
            console.log("---> SUCCESS UUID:");
            let id_map = {};
            for (let key in response["id_list"]){
                id_map[response["id_list"][key]] = {"status": 0, "resultS3Key": ""}
            }
            console.log("id_list",id_map);
            /* Example id_map
                {
                    "123-asd": {"status": 0, "resultS3key": null},
                    "234-sdf": {"status": 0, "resultS3key": null},
                    "345-dfg": {"status": 0, "resultS3key": null}
                }
            */
            setState({...state, "status_id":1, "status_img":id_map,"loading":true});
        }
        return;
    }

    async function getS3keys(id_map) {
        
        let counter = 5;
        let url = `http://${process.env.REACT_APP_gateway_host || "localhost"}:${process.env.REACT_APP_gateway_port || "8082"}/status?id=`;
        console.log("Fetching keys for:", id_map);
        while (counter--) {
            for (const id in id_map) {
                if (id_map[id]["status"] === 0) {
                    const response = await fetch(url+id,
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
                        .then(response => response.json())
                        .then(response => {
                            console.log(response);
                            if (response["status"] === -1 || response["error"]) {
                                return {"status": -1, "resultS3Key": "", "comments":response["error"]}
                            }
                            else {
                                return {"status":response["status"], "resultS3Key":response["resultS3Key"], "comments":response["comments"]}
                            }
                        })
                        .catch(error => ({"status": -1, "resultS3Key":"", "comments":error}));
                    
                    id_map[id] = {...id_map[id], ...response};
                }
            }
            /* Example JSON Response for every UUID.
                {
                    "requestId": "1f402c85-b0f2-4a17-8705-2e01bcd1f947",
                    "dataSource": "merra",
                    "parameters": "radar=KABR\nplotType=velocity\nmonth=01\nyear=2021\nday=31\n",
                    "status": 1,
                    "resultS3Key": "1f402c85-b0f2-4a17-8705-2e01bcd1f947",
                    "timestamp": "2022-04-03 16:58:02.956",
                    "comments": "successfully completed request"
                }
            */
            let completed = true;
            for (const id in id_map) {
                console.log("id",id,":",id_map[id]["status"]);
                if (!id_map[id]["status"]) completed = false; 
            }
            if (completed) {
                console.log("Completed");
                console.log(id_map);
                let id_map1 = await getImage(id_map);
                setState({...state, "status_img":id_map1, "loading":false});
                break;
            }
            else {
                console.log("Counter:",counter);
                if (counter>0){
                    await sleep(10000);
                    console.log("still loading");
                }
                else{
                    let id_map1 = await getImage(id_map);
                    setState({...state, "status_img":id_map1, "loading":false});
                    break;
                }
            }
        }
    }

    async function getImage(id_map) {
        console.log("in getImage");
        let url = `http://${process.env.REACT_APP_gateway_host || "localhost"}:${process.env.REACT_APP_gateway_port || "8082"}/image?id=`;
        for (const id in id_map) {

            console.log("id",id,":",id_map[id]);
            if (id_map[id]["status"] === 1){
                let img_url_response = await fetch( url+id_map[id]["resultS3Key"],
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
                console.log( img_url_response );
                if (img_url_response["image"]) id_map[id]["img_url"] = img_url_response["image"]
                else{
                    id_map[id]["status"] = -1;
                    id_map[id]["comments"] = img_url_response["error"];
                }
            }
        }
        return id_map;
    }


    return (
        <div className="merra">
            {userAuthDetails ?
                <div>
                    <Navbar page="merra"/>

                    {/*  Merra Dashboard */}
                    <div className = "MerraDashboard" style = {{display:"flex", height: "93.9vh"}}>

                        {/* Merra Input Pane */}   
                        <div className = "merra-input" style={{"flex":1, flexDirection:"column", "border": "1px solid black"}}>
                        <MerraInput inputCollector = {inputProcessor} params={params} />
                        </div>
                        

                        {/*  Merra Display Pane */}
                        <div style={{"flex":3, "border": "1px solid black"}}>display
                        <MerraPlot />
                        </div>

                    </div>
                </div>
            : <Login />}
        </div>
    )
}

export default MerraDashboard;
