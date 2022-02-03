import React from "react";

const Plot = ({partochild}) => {
    console.log("Plotting",partochild);
    let forecast = partochild;
    return <div className="plot">
    <img src={forecast.imageUrl} alt="Weather plots" style="border: 5px solid black"></img>
    {
        forecast.stormExist ? (<div><text>Possibility of storm</text><text>{forecast.weatherForecas["humidity"]}</text></div>)
        :(<div><text>No possibility of a storm</text></div>)
    }
    
    </div>;
};

export default Plot;
