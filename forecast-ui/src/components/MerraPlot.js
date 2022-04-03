

import React, { useContext } from 'react'
import { MerraContext } from './Context';

function MerraPlot() {
    const { state } = useContext(MerraContext);
    console.log("In Plot:", state);

    if (state["loading"]){
        if (state["status_id"] === -1){
            return <div className="plot">Failed to fetch weather data for the selected inputs, please try again!</div>
        }
        else if (state["status_id"] === 1){
            console.log("Loading...")
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
                const image= `data:image/png;base64,`+state["img"];
                return(
                    <div><img src={image} alt="Weather plots"/></div>
                )
            }
        }
        else {
            
            return <div className="plot">Failed to fetch UUID, please try again!</div>
        }
    }
}

export default MerraPlot