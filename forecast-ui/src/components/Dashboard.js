import React, { useContext, useEffect } from "react";
import { StateContext, UserContext } from "./Context";

// Import required components.
import Input from "./Input";
import Plot from "./Plot";


function Dashboard() {

    const { state, setState } = useContext(StateContext);
    const { userAuthDetails } = useContext(UserContext);

    useEffect(() => {
        console.log("In effect",state);
        if (state["loading"] && state["status_id"] && !state["status_img"]){
            getImage(state["id"]);     
        }
    },[state]);

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function InputProcessor(userInputs) {
        
        console.log("In processor",state["loading"]);
        
        const reqObject = {
                        "year":userInputs.date.getFullYear(),
                        "month": userInputs.date.getMonth()+1,
                        "day": userInputs.date.getDate(),
                        "startTime": userInputs.time,
                        "endTime": userInputs.time,
                        "radar": userInputs.radar
                    };
        const url = `http://${process.env.REACT_APP_gateway_host || "localhost"}:${process.env.REACT_APP_gateway_port || "8082"}/data`;
        const response = await fetch(url,
                        {   method: "POST",
                            headers: {
                                "id_token": userAuthDetails.id_token,
                                "name": userAuthDetails.name,
                                "email": userAuthDetails.email,
                                'Content-Type':'application/json',
                            },
                            body: JSON.stringify(reqObject),
                        }).then(response => {
                            return response.json();
                        })
                        .then(response =>{
                            console.log(response);
                            return {"status_id":1, "id":response["id"]}})
                        .catch(error => ({"status_id":-1,"error":error}))
        if (response["status_id"] === -1){
            console.log("XXX ERROR:",response);
            setState({...state,response,"status_img":0});
        }
        else{
            console.log("---> SUCCESS:",response);
            setState({...state, ...response,"status_img":0,"loading":true});
        }
        
            
    }
    async function getImage(id) {
        console.log("---> Fetching image for id:",id);
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
                        .then(response => {return response.json()})
                        .then(response => { console.log("STATUS",response);  return {"status_img":response["status"], img:response["image"]}})
                        .catch(error => ({"status_img": -1, "img":"","error":error}))
            if (response["status_img"] === 1){
                console.log("---> SUCCESS RECIEVED:",response);
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
        <div>
            <Input InputCollector={InputProcessor}/>
            <Plot />
        </div>
    )
};

export default Dashboard;
