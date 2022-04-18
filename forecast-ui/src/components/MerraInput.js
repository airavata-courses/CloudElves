import React, { useState, useContext } from "react";
import { Button, TextField, Select, MenuItem, InputLabel,Checkbox, ListItemText, OutlinedInput, FormControlLabel} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
// import { BugReportOutlined, BugReport } from '@mui/icons-material';
import {defaultParams} from "./constants";
import { formatVariables, formatDate } from "./helper";
import { MerraContext } from './Context';
function MerraInput (props) {
    const params = defaultParams;
    const [product, setProduct] = useState(params[0]["productName"]);
    const [variableList, setVariableList] = useState(params[0]["variableNames"]);
    const [variables, setVariables] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [outputType, setOutputType] = useState("image");
    // const [debug, setDebug] = useState(false);

    const { state } = useContext(MerraContext);


    function inputHandler(event) {
        event.preventDefault();
        
        props.inputCollector({
            "product": product,
            "varNames": formatVariables(variables, variableList),
            "startDate": formatDate(startDate),
            "endDate": formatDate(endDate),
            // "debug": debug,
            "outputType": outputType
        });
    }

    function initInputs(event) {
        const index = params.findIndex( x => x["productName"] === event.target.value);
        setProduct(params[index]["productName"]);
        setVariableList(params[index]["variableNames"]);
        setVariables([]);
        return;
    }

    return (
        <form onSubmit={inputHandler}>
            <div style={{ "flexDirection":"row", margin:"15px" }}>

                <InputLabel id="demo-simple-select-label">Select Product</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={product}
                name="product"
                label="Select Product"
                onChange={(event)=>initInputs(event)}>
                {params.map((x, idx)=><MenuItem key={idx} value={x["productName"]}>{x["productName"]}</MenuItem>)}
                </Select>

            </div>

            <div style={{ "flexDirection":"row", margin:"15px" }}>

                <InputLabel id="demo-multiple-checkbox-label">Select Variables</InputLabel>
                <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={variables}
                name="variables"
                onChange={(event) => setVariables(event.target.value)}
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected) => (selected.join(','))}
                MenuProps={{PaperProps: {
                    style: {
                        maxHeight: 48 * 4.5 + 8,
                        width: 250,
                    },
                    },}}
                sx={{width:300}}
                required
                >
                {Object.keys(variableList).map((x, idx) => {return (
                    <MenuItem key={idx} value={x}>
                    <Checkbox checked={variables.indexOf(x) > -1} />
                    <ListItemText primary={x} />
                    </MenuItem>
                )})}
                </Select>

            </div>

            <div style={{ "flexDirection":"row", margin:"15px" }}>

                <InputLabel id="demo-multiple-checkbox-label">Start Date</InputLabel>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                label="Select Date"
                value={startDate}
                name="startDate"
                onChange={(newValue) => { setStartDate(new Date(newValue));}}
                maxDate={new Date()}
                required
                renderInput={(params) => <TextField {...params} />} />
                </LocalizationProvider>

            </div>
            <div style={{ "flexDirection":"row", margin:"15px" }}>

                <InputLabel id="demo-multiple-checkbox-label">End Date</InputLabel>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                label="Select Date"
                value={endDate}
                name="endDate"
                onChange={(newValue) => { setEndDate(new Date(newValue));}}
                maxDate={new Date()}
                minDate={new Date(startDate)}
                required
                renderInput={(params) => <TextField {...params} />} />
                </LocalizationProvider>

            </div>
            <div style={{ "flexDirection":"row", margin:"15px" }}>
                {/* <FormControlLabel control={<Checkbox onClick={() => setDebug(!debug)} name="debug" icon={<BugReportOutlined />} checkedIcon={<BugReport />} />} label="Debug" /> */}
                <InputLabel id="demo-simple-select-label">Output Type</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={outputType}
                name="outputType"
                label="Output Type"
                onChange={(event)=>setOutputType(event.target.value)}>
                {["image", "gif"].map((x, idx)=><MenuItem key={idx} value={x}>{x}</MenuItem>)}
                </Select>
            </div>
            <div style={{ "flexDirection":"row", margin:"15px" }}>
                
                <Button disabled={state["loading"]} variant="contained" type="submit">Find</Button>

            </div>
        </form>
    )
}

export default MerraInput;