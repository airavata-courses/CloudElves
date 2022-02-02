import React, {useState} from "react";
import DatePicker from "react-datepicker";
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/TimePicker';
import "react-datepicker/dist/react-datepicker.css";


const Input = (props) => {
	const [date, setDate] = useState(new Date());
 	// const [endDate, setEndDate] = useState(new Date());
     const [time, setTime] = useState(null);
	const [radarStation, setStation] = useState("ABC");
	const InputHandler = async(event) =>{
		event.preventDefault();
		// console.log( date.getFullYear(),"/",time,"/",radarStation);
		props.InputCollector({"date":date, "time": time, "radarStation": radarStation});
	}

    return (
        <div className="container">
            <div className="row">
                <form className="row g-3 needs-validation" onSubmit={InputHandler} noValidate>
                    <div className="col-md-3">
                        <label htmlFor="validationCustom03" className="form-label">Date</label>
                        <DatePicker className="form-control" id="validationCustom03"
                            selected={date}
                            selectsStart
                            startDate={date}
                            maxDate={date}
                            onChange={(date) => setDate(date)}
                            required
						/>
                         <div className="invalid-feedback">
                            Please provide a valid city.
                        </div>
                    </div>
                    <div className="col-md-3">
                        {/* <label htmlFor="validationCustom03" className="form-label">Start Date</label> */}
						<LocalizationProvider dateAdapter={AdapterDateFns}>
                            <TimePicker
                            
                            label="Select time"
                            value={time}
                            onChange={(newValue) => {setTime(newValue); }}
                            renderInput={(params) => <TextField {...params} />}
                            className="form-control" id="validationCustom03"
                            />
                        </LocalizationProvider>
                    </div>
    
					{/* <div className="col-md-3">
						<label htmlFor="validationCustom03" className="form-label"> End Date </label>
                        <DatePicker className="form-control" id="validationCustom03"
                            selected={endDate}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            onChange={(date) => setEndDate(date)}
                        />
					</div> */}

                    <div className="col-md-3">
                        <label htmlFor="validationCustom05"  className="form-label">
                            Station
                        </label>
                        <select className="form-select" id="validationCustom04" value = {radarStation} onChange={(event) => setStation(event.target.value)} required>
                        <option defaultValue="ABC"> Select a station</option>
                            {['FOP1', 'KABR', 'KABX', 'KAKQ', 'KAMA', 'KAMX', 'KAPX', 'KARX', 'KATX', 'KBBX', 'KBGM', 'KBHX', 'KBIS', 'KBLX', 'KBMX', 'KBOX', 'KBRO', 'KBUF', 'KBYX', 'KCAE', 'KCBW', 'KCBX', 'KCCX', 'KCLE', 'KCLX', 'KCRP', 'KCXX', 'KCYS', 'KDAX', 'KDDC', 'KDFX', 'KDGX', 'KDIX', 'KDLH', 'KDMX', 'KDOX', 'KDTX', 'KDVN', 'KDYX', 'KEAX', 'KEMX', 'KENX', 'KEOX', 'KEPZ', 'KESX', 'KEVX', 'KEWX', 'KEYX', 'KFCX', 'KFDR', 'KFDX', 'KFFC', 'KFSD', 'KFSX', 'KFTG', 'KFWS', 'KGGW', 'KGJX', 'KGLD', 'KGRB', 'KGRK', 'KGRR', 'KGSP', 'KGWX', 'KGYX', 'KHDX', 'KHGX', 'KHNX', 'KHPX', 'KHTX', 'KICT', 'KICX', 'KILN', 'KILX', 'KIND', 'KINX', 'KIWA', 'KIWX', 'KJAX', 'KJGX', 'KJKL', 'KLBB', 'KLCH', 'KLGX', 'KLIX', 'KLNX', 'KLOT', 'KLRX', 'KLSX', 'KLTX', 'KLVX', 'KLWX', 'KLZK', 'KMAF', 'KMAX', 'KMBX', 'KMHX', 'KMKX', 'KMLB', 'KMOB', 'KMPX', 'KMQT', 'KMRX', 'KMSX', 'KMTX', 'KMUX', 'KMVX', 'KMXX', 'KNKX', 'KNQA', 'KOAX', 'KOHX', 'KOKX', 'KOTX', 'KPAH', 'KPBZ', 'KPDT', 'KPOE', 'KPUX', 'KRAX', 'KRGX', 'KRIW', 'KRLX', 'KRTX', 'KSFX', 'KSGF', 'KSHV', 'KSJT', 'KSOX', 'KSRX', 'KTBW', 'KTFX', 'KTLH', 'KTLX', 'KTWX', 'KTYX', 'KUDX', 'KUEX', 'KVAX', 'KVBX', 'KVNX', 'KVTX', 'KVWX', 'KYUX', 'PABC', 'PACG', 'PAEC', 'PAHG', 'PAIH', 'PAKC', 'PAPD', 'PHKI', 'PHKM', 'PHMO', 'PHWA', 'RKJK', 'RKSG', 'RODN', 'TADW', 'TBNA', 'TBOS', 'TBWI', 'TCLT', 'TCMH', 'TCVG', 'TDAL', 'TDAY', 'TDCA', 'TDEN', 'TDFW', 'TDTW', 'TEWR', 'TFLL', 'THOU', 'TIAD', 'TIAH', 'TICH', 'TIDS', 'TJFK', 'TJUA', 'TLAS', 'TLVE', 'TMCI', 'TMCO', 'TMDW', 'TMEM', 'TMIA', 'TMKE', 'TMSP', 'TMSY', 'TOKC', 'TORD', 'TPBI', 'TPHL', 'TPHX', 'TPIT', 'TRDU', 'TSDF', 'TSLC', 'TSTL', 'TTPA', 'TTUL'].map((x)=><option value={x}>{x}</option>)}
                        </select>
                    </div>
                    <div className="col-md-3" style={{  justifyContent:"normal"}}>
                        <button className="btn btn-primary" type = "submit" style={{marginTop:"35px",alignSelf:"center"}} >
                            Find
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Input;
