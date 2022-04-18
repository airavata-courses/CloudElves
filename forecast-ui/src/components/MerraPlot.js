import React, { useContext } from 'react'
import { MerraContext } from './Context';

function MerraPlot() {
    const { state } = useContext(MerraContext);
    console.log("In Merra Plot:");

    if (state["loading"]) {
        if (state["status_id"] === -1){
            return <div className="plot">Failed to fetch UUID, please try again!</div>
        }
        else if (state["status_id"] === 1){
            console.log("Loading...")
            return <div className="plot">Loading...</div>
        }
        else{
            return <div className="plot">Failed to fetch UUID, please try again!</div>
        }
    }
    else {
        if (state["status_id"] === 0){
            return (<div>Please provide some inputs to get weather forecast.</div>)
        }
        else if (state["status_id"] === 1) {
            console.log("Image retrieval complete!");
            return (
                <div>
                    {Object.keys(state["status_img"]).map((id) => {
                        console.log(id,state["status_img"][id]["status"]);
                        let image = '';
                        if (state["outputType"] === "image") {
                            image = `data:image/png;base64, ${state["status_img"][id]["img_url"]}`;
                        }
                        else{
                            image = `data:image/gif;base64, ${state["status_img"][id]["img_url"]}`;
                        } 
                        
                        if (state["status_img"][id]["status"] === 1) return <img src={image} alt="Merra plots" />
                        else return <div>Error in getting image</div>
                    })}
                </div>     
            )

        }
        else {
            
            return <div className="plot">Failed to fetch UUID, please try again!</div>
        }
    }
}

export default MerraPlot