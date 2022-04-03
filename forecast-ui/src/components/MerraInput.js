import React, { useState } from "react";
import { Button, TextField, Select, MenuItem, InputLabel,Checkbox, ListItemText, OutlinedInput} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { BugReportOutlined, BugReport} from '@mui/icons-material';

function MerraInput (props) {
    const params = props.params;
    const [product, setProduct] = useState(params[0]["productName"]);
    const [variableList, setVariableList] = useState(params[0]["variableNames"]);
    const [variables, setVariables] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [debug, setDebug] = useState(false);

    function inputHandler(event) {
        event.preventDefault();
        props.inputCollector({
            "product": product,
            "variables": variables,
            "startDate": startDate,
            "endDate": endDate,
            "debug": debug
        })
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
                onChange={(event)=>{
                    const index = params.findIndex( x => x["productName"] === event.target.value);
                    setProduct(params[index]["productName"]);
                    setVariableList(params[index]["variableNames"]);
                    setVariables([]);
                    return;
                    }
                }>
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
                onChange={
                    (event) => {
                        const {
                        target: { value },
                        } = event;
                        setVariables(
                        // On autofill we get a stringified value.
                        typeof value === 'string' ? value.split(',') : value,
                        );
                }}
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={{PaperProps: {
                    style: {
                        maxHeight: 48 * 4.5 + 8,
                        width: 250,
                    },
                    },}}
                sx={{width:300}}
                required
                >
                {variableList.map((x, idx) => (
                    <MenuItem key={idx} value={x["label"]}>
                    <Checkbox checked={variables.indexOf(x["label"]) > -1} />
                    <ListItemText primary={x["label"]} />
                    </MenuItem>
                ))}
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
                
                <Checkbox {...{inputProps: { 'aria-label': 'Checkbox demo' }}} onClick={() => setDebug(!debug)} name="debug" icon={<BugReportOutlined />} checkedIcon={<BugReport />} />
                
            </div>
            <div style={{ "flexDirection":"row", margin:"15px" }}>
                
                <Button variant="contained" type="submit">Find</Button>

            </div>
        </form>
    )
}

export default MerraInput;