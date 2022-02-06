import React, {useContext, useEffect, useState} from "react";
// Import required components.
import Input from "./Input";
import Plot from "./Plot";
import { UserContext } from "./Context";

// This function renders dashboard components in Home page.
const Dashboard = () => {
    const {userAuthDetails} = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [submit, didSubmit] = useState(false);
    const [plot, setPlot] = useState(null);
    
    useEffect(() => {
        if (!loading && submit) setLoading(false);
    }, [loading, submit]);

    const InputProcessor = (userInput) => {
        didSubmit(true);
        const reqObject = {
            "year":userInput.date.getFullYear(),
            "month": userInput.date.getMonth()+1,
            "day": userInput.date.getDate(),
            "startTime": userInput.time,
            "endTime": userInput.time,
            "radarStation": userInput.radarStation
        };

        fetchData(reqObject);
        // setInterval(() => {
        //     setLoading(false);
        // }, 2000);
    };

    const fetchData = async (input) => {

        let url = `http://localhost:8082/data`;

        await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "id_token": userAuthDetails.id_token,
                "name": userAuthDetails.name,
                "email": userAuthDetails.email
            },
            body: JSON.stringify(input),
            })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setPlot({"success":data});
                setLoading(false);
                // return {"success":data};
            })
            .catch((error) => {
                console.log("error: ", error);
                setPlot({"error":error});
                setLoading(false);
                // return {"error":error};
            });

            
    }

    return (
        <div className="dashboard">
            <Input InputCollector={InputProcessor} />
            {!submit ? (<div>Please provide some inputs to get weather forecast.</div>) : loading ? (<div>Loading</div>) : (<Plot partochild={plot} />)}
        </div>
    );
};

export default Dashboard;
