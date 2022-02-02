import React, {useContext, useEffect, useState} from "react";

import Input from "./Input";
import Plot from "./Plot";
import { UserContext } from "./Context";
const Dashboard = () => {
    const {userAuthDetails} = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [submit, didSubmit] = useState(false);
    const [plot, setPlot] = useState("helo");
    
    const fetchData = async (input) =>{
        console.log("data to generate url",input);
        const url = ` http://localhost:8000/getdata?year=${input.year}&month=${input.month}&day=${input.day}&starttime=${input.startTime}&endtime=${input.endTime}&radar=${input.radarStation}&id=292`;
        console.log(url);
        const response = await fetch(url, {
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
                console.log("Success:", data);
                return data;
            })
            .catch((error) => {
                console.error("Error:", error);
            });
        console.log(response);
        setPlot(response);
    }
    useEffect(() => {
        if (!loading && submit) {
            setLoading(false);
        }
    }, [loading, submit]);
    const InputProcessor = async (userInput) => {
        setLoading(true);
        didSubmit(true);
        const reqObject = {
            "year":userInput.date.getFullYear(),
            "month": userInput.date.getMonth()+1,
            "day": userInput.date.getDate(),
            "startTime": userInput.time.getTime(),
            "endTime": userInput.time.getTime(),
            "radarStation": userInput.radarStation
        };
        await fetchData(reqObject);
        setInterval(() => {
            setLoading(false);
        }, 2000);
    };

    return (
        <div className="dashboard">
            <Input InputCollector={InputProcessor} />
            {!submit ? (<div>Init</div>) : loading ? (<div>Loading</div>) : (<Plot partochild={plot} />)}
        </div>
    );
};

export default Dashboard;
