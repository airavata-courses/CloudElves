import React from "react";

// This function plots the data received from api gateway.
const Plot = ({partochild}) => {

    console.log("Data received",partochild);

    if (partochild.error){
        return <div className="plot">Failed to fetch weather data for the selected inputs, please try again!</div>
    }
    else {
        let forecast = partochild.success;
        return (
            <div className="plot">
                { forecast.stormExist ? (<div><div>Possibility of storm</div><div>{forecast.weatherForecas["humidity"]}</div></div>)
                    :(<div><div>No possibility of a storm</div></div>)
                }
                <img src={forecast.imageUrl} alt="Weather plots"/>
                
            </div>
        );
    }
};

export default Plot;
