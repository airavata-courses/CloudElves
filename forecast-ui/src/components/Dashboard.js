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















        // const reqObject = {
        //                 "year":String(userInputs.date.getFullYear()),
        //                 "month": String(userInputs.date.getMonth()+1),
        //                 "day": String(userInputs.date.getDate()),
        //                 "startTime": String(userInputs.time),
        //                 "endTime": String(userInputs.time),
        //                 "radar": String(userInputs.radar)
        //             };
        
     
        // const response = await fetch("http://localhost:8082",
        //         {
        //             method: "POST",
        //             // headers: {
        //             //     "Content-Type": "application/json",
        //             //     "id_token": userAuthDetails.id_token,
        //             //     "name": userAuthDetails.name,
        //             //     "email": userAuthDetails.email
        //             // },
        //             body: JSON.stringify(reqObject),
        //         })
        //     .then(responseObj => responseObj.json())
        //     .then(data_recv => {
        //         console.log('Id received:', data_recv);
        //         setState({"status":0,"id":data_recv["id"], "image":""});
        //         getImage(data_recv["id"]);
              
        //     })
        //     .catch((error) => {
        //         console.error('XXX ERROR:', error);
        //         setState({"status": -1, "error":error});
        //         setLoading(false);
        //     });




















// This function renders dashboard components in Home page.
// const Dashboard = () => {
//     const {userAuthDetails} = useContext(UserContext);
//     const [state, setState] = useState({"loading":false, "submit":false});
//     const [plot, setPlot] = useState(null);

//     const 
//     const InputProcessor =  (userInput) => {
//         setState({"loading":true, "submit": true});
        
//         console.log("bev true");    
//         setTimeout(()=>{console.log("timeout")},1000);
//         const reqObject = {
//             "year":String(userInput.date.getFullYear()),
//             "month": String(userInput.date.getMonth()+1),
//             "day": String(userInput.date.getDate()),
//             "startTime": String(userInput.time),
//             "endTime": String(userInput.time),
//             "radar": String(userInput.radar)
//         };

//          fetchData(reqObject);
//     };

//     const fetchData = async (input) => {

//         const url = `http://localhost:8082/data`;
//         setTimeout(1000);
//         await fetch(url, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "id_token": userAuthDetails.id_token,
//                 "name": userAuthDetails.name,
//                 "email": userAuthDetails.email
//             },
//             body: JSON.stringify(input),
//             })
//             .then((response) => response.json())
//             .then((data) => {
//                 console.log("id:",data["id"]);
//                 setPlot({"success":data});
//                 setTimeout(()=>{console.log("timeout")},1500);
//                 setState({"loading":false, "submit": true});
//             })
//             .catch((error) => {
//                 setTimeout(()=>{console.log("timeout")},1500);
//                 console.log("XXXerror: ", error);
//                 setPlot({"error":error});
                
//                 setState({"loading":false, "submit": true});
//             });
//     }

//     return (
//         <div className="dashboard">
//             <Input InputCollector={InputProcessor} isLoading = {state.loading}/>
//             <Plot  state = {state} plot = {plot}/>
//             {/* {!submit ? (<div>Please provide some inputs to get weather forecast.</div>) : loading ? (<div>Loading</div>) : (<Plot partochild={plot} />)} */}
//         </div>
//     );
// };

export default Dashboard;
