import React, {useContext, useState} from "react";
import { StateContext } from "./Context";

// This function plots the data received from api gateway.

const Plot = () => {

    const { state } = useContext(StateContext);
    console.log("Nexrad Plot", state);

    if (state["loading"]){
        if (state["status_id"] === -1){
            return <div className="plot">Failed to fetch weather data for the selected inputs, please try again!</div>
        }
        else if (state["status_id"] === 1){
            return <div className="plot">Loading...</div>
        }
        else{
            return <div className="plot">Failed to fetch UUID, please try again!</div>
        }
    }
    else{
        if (state["status_id"] === 0){
            return (<div>Please provide some inputs to get weather forecast.</div>)
        }
        else if (state["status_id"] === 1){
            if (state["status_img"] === -1){
                return <div className="plot">Failed to fetch images for weather data for the selected inputs, please try again!</div>
            }
            else{
                const image= `data:image/png;base64, ${state["img_url"]}`;
                return(
                    <div>
                        <img src={image} alt="Weather plots"/>
                    </div>
                )
            }
        }
        else {
            return <div className="plot">Failed to fetch UUID, please try again!</div>
        }
    }
};

export default Plot;
