import React, {useEffect, useState} from "react";

import Input from "./Input";
import Plot from "./Plot";
const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [submit, didSubmit] = useState(false);
    const [plot, setPlot] = useState("helo");
    const fetchData = (data) =>{
        fetch("https:localhost:8080/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((data) => {
                // console.log("Success:", data);
                return data;
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }
    useEffect(() => {
        if (!loading && submit) {
            setLoading(false);
        }
    }, [loading, submit]);
    const InputProcessor = async (data) => {
        // console.log(data);
        // console.log(plot);
        setLoading(true);
        didSubmit(true);
        // plot = await fetchData(data) || "hello";
        setPlot("hello");
        // console.log(plot);
        setInterval(() => {
            setLoading(false);
        }, 2000);
        
       
        // return plot
    };

    return <div className="dashboard">
        <Input InputCollector = {InputProcessor} /> 
        {!submit ? <div>Init</div>: loading ? <div>Loading</div> : <Plot partochild={plot}/>}
        
    </div>;
};

export default Dashboard;
