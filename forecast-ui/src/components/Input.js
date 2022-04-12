import React, {useState, useContext} from "react";
// import {Button} from "react-bootstrap";
import {Button, TextField, Select, MenuItem, InputLabel, FormControl} from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {DatePicker, LocalizationProvider} from '@mui/lab';
// Import required components.
import { StateContext } from "./Context";

// This function handles user inputs for fetching the weather plots.
const Input = (props) => {
    const radarList = ['KABR', 'KABX', 'KAKQ', 'KAMA', 'KAMX', 'KAPX', 'KARX', 'KATX', 'KBBX', 'KBGM', 'KBHX', 'KBIS', 'KBLX', 'KBMX', 'KBOX', 'KBRO', 'KBUF', 'KBYX', 'KCAE', 'KCBW', 'KCBX', 'KCCX', 'KCLE', 'KCLX', 'KCRP', 'KCXX', 'KCYS', 'KDAX', 'KDDC', 'KDFX', 'KDGX', 'KDIX', 'KDLH', 'KDMX', 'KDOX', 'KDTX', 'KDVN', 'KDYX', 'KEAX', 'KEMX', 'KENX', 'KEOX', 'KEPZ', 'KESX', 'KEVX', 'KEWX', 'KEYX', 'KFCX', 'KFDR', 'KFDX', 'KFFC', 'KFSD', 'KFSX', 'KFTG', 'KFWS', 'KGGW', 'KGJX', 'KGLD', 'KGRB', 'KGRK', 'KGRR', 'KGSP', 'KGWX', 'KGYX', 'KHDX', 'KHGX', 'KHNX', 'KHPX', 'KHTX', 'KICT', 'KICX', 'KILN', 'KILX', 'KIND', 'KINX', 'KIWA', 'KIWX', 'KJAX', 'KJGX', 'KJKL', 'KLBB', 'KLCH', 'KLGX', 'KLIX', 'KLNX', 'KLOT', 'KLRX', 'KLSX', 'KLTX', 'KLVX', 'KLWX', 'KLZK', 'KMAF', 'KMAX', 'KMBX', 'KMHX', 'KMKX', 'KMLB', 'KMOB', 'KMPX', 'KMQT', 'KMRX', 'KMSX', 'KMTX', 'KMUX', 'KMVX', 'KMXX', 'KNKX', 'KNQA', 'KOAX', 'KOHX', 'KOKX', 'KOTX', 'KPAH', 'KPBZ', 'KPDT', 'KPOE', 'KPUX', 'KRAX', 'KRGX', 'KRIW', 'KRLX', 'KRTX', 'KSFX', 'KSGF', 'KSHV', 'KSJT', 'KSOX', 'KSRX', 'KTBW', 'KTFX', 'KTLH', 'KTLX', 'KTWX', 'KTYX', 'KUDX', 'KUEX', 'KVAX', 'KVBX', 'KVNX', 'KVTX', 'KVWX', 'KYUX', 'PABC', 'PACG', 'PAEC', 'PAHG', 'PAIH', 'PAKC', 'PAPD', 'PHKI', 'PHKM', 'PHMO', 'PHWA', 'RKJK', 'RKSG', 'RODN', 'TADW', 'TBNA', 'TBOS', 'TBWI', 'TCLT', 'TCMH', 'TCVG', 'TDAL', 'TDAY', 'TDCA', 'TDEN', 'TDFW', 'TDTW', 'TEWR', 'TFLL', 'THOU', 'TIAD', 'TIAH', 'TICH', 'TIDS', 'TJFK', 'TJUA', 'TLAS', 'TLVE', 'TMCI', 'TMCO', 'TMDW', 'TMEM', 'TMIA', 'TMKE', 'TMSP', 'TMSY', 'TOKC', 'TORD', 'TPBI', 'TPHL', 'TPHX', 'TPIT', 'TRDU', 'TSDF', 'TSLC', 'TSTL', 'TTPA', 'TTUL'];
	const [date, setDate] = useState(new Date());
    const [plot, setPlot] = useState("reflectivity");
    const [radar, setRadar] = useState(radarList[0]);
    const { state } = useContext(StateContext);
	
	function inputHandler(event) {
        event.preventDefault();
        props.inputCollector({ "year": date.getFullYear(), "month": date.getMonth()+1, "day":date.getDate(), "plotType": plot, "radar": radar });
    }

    return (
        <div>
            <form  style={{ border: "1px solid black", display: "flex", flexDirection:"row", verticalAlign:"center" , justifyContent:"center"}} onSubmit={inputHandler}>
                <div style={{flex: '1 !important', padding:"30px", width:"20%"}}>
                    <FormControl style={{width:"60%"}}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Select Date"
                        value={date}
                        onChange={(newValue) => { setDate(new Date(newValue));}}
                        maxDate={new Date()}
                        required
                        renderInput={(params) => <TextField {...params} />}
                    />
                    </LocalizationProvider>
                    </FormControl>
                </div>

                <div style={{flex: '1 !important', padding:"30px", width:"20%"}}>
                    <FormControl style={{width:"60%"}}>    
                    <InputLabel id="demo-simple-select-label">Select Plot</InputLabel>
                    <Select
                        value={plot}
                        label="Select Plot"
                        onChange={(event)=>setPlot(event.target.value)}>
                        {["reflectivity", "velocity"].map((x)=><MenuItem key={x} value={x}>{x}</MenuItem>)}
                    </Select>
                    </FormControl>
                </div>

                <div style={{flex: '1 !important', padding:"30px", width:"20%"}}>
                    <FormControl style={{width:"60%"}}>    
                    <InputLabel id="demo-simple-select-label">Select Station</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={radar}
                    label="Select Station"
                    onChange={(event)=>setRadar(event.target.value)}
                    >
                        {radarList.map((x)=><MenuItem key={x} value={x}>{x}</MenuItem>)}
                    </Select>
                    </FormControl>
                </div>

                <div style={{flex: '1 !important', padding:"30px", width:"20%"}}>
                    <Button disabled={state["loading"]} variant="contained" type="submit" style={{ padding:"15px", width:"50%"}}>Find</Button>
                </div>
            </form>
        </div>
    );
};

export default Input;
