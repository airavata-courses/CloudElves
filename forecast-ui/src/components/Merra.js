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
    const [params, setParams] = useState(defaultParams);
    const sleep = (ms) => (new Promise(resolve => setTimeout(resolve, ms)));

    useEffect(() => {
        console.log("In Effect: Init");
        if (userAuthDetails) fetchParameters();
    }, [userAuthDetails]);

    useEffect(() => {
        console.log("State", state);
        if (state["loading"] && state["status_id"] && !state["status_img"]) getPlot(state["id"]);

    }, [state]);

    async function fetchParameters() {
        const url = "getParams";
        const response = await fetch(url, {
            method: "GET",
            headers: {},
        }).then(response => response.json())
            .then(response => { console.log(response); return { "status": 1, "params": response }; })
            .catch(error => {
                console.log("XXX Error!");
                return { "status": -1, "error": error };
            });
        if (response["status"] === 1)
            setParams(response["params"]);
    }

    async function inputProcessor (userInputs) {
        console.log(userInputs);
        console.log("Loading", state["loading"]);
        await getId(userInputs);
        return;
    }

    async function getId(data) {
        const url = "http://localhost:8082/getId";
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "id_token": userAuthDetails.id_token,
                "name": userAuthDetails.name,
                "email": userAuthDetails.email,
                'Content-Type':'application/json',
            },
            body: JSON.stringify(data),
        }).then(response => (response.json()))
            .then(response => ({"status_id":1, "id":response["id"]}))
            .catch( error => ({"status_id":-1,"error":error}));

        if (response["status_id"] === -1){
            console.log("XXX ERROR in fetching UUID:",response);
            setState({...state,...response, "status_img":0});
        }
        else{
            console.log("---> SUCCESS UUID:",response);
            setState({...state, ...response,"status_img":0,"loading":true});
        }
        return;
    }

    async function getPlot(id) {
        let counter = 10;
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
                        .then(response => response.json())
                        .then(response => ({"status_img":response["status"], img:response["image"]}))
                        .catch(error => ({"status_img": -1, "img":"", "error":error}))
            if (response["status_img"] === 1){
                console.log("---> SUCCESS IMAGE:",response);
                setState({...state,...response,"loading":false});
                break;
            }
            else if (response["status_img" === -1]){
                console.log("---> ERROR IMAGE:",response);
                setState({...state,...response,"loading":false});
                break;
            }
            else{
                console.log("Counter:",counter);
                if (counter>0){
                    await sleep(2000);
                    console.log("still loading");
                }
                else{
                    console.log("---> ERROR IMAGE:",response);
                    setState({...state,...response,"loading":false});
                    break;
                }
            }
        }
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
