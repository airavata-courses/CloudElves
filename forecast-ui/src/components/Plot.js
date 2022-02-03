import React from "react";

const Plot = ({partochild}) => {
    console.log("Plotting",partochild);
    let forecast = partochild;
    return <div className="plot">
    <img src={forecast.imageUrl} alt="Weather plots"></img>
    {
        forecast.stormExist ? (<div><div>Possibility of storm</div><div>{forecast.weatherForecas["humidity"]}</div></div>)
        :(<div><div>No possibility of a storm</div></div>)
    }
    
    </div>;
};

export default Plot;
