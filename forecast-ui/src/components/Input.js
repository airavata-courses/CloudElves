import React, {useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



const Input = (props) => {
	const [startDate, setStartDate] = useState(new Date());
 	const [endDate, setEndDate] = useState(new Date());
	const [radarStation, setStation] = useState("ABC");
	const InputHandler = async(event) =>{
		event.preventDefault();
		// console.log(startDate, endDate, radarStation);
		props.InputCollector({"startDate":startDate, "endDate": endDate, "radarStation": radarStation});
	}

    return (
        <div className="container">
            <div className="row">
                <form className="row g-3 needs-validation" onSubmit={InputHandler} noValidate>
                    <div className="col-md-3">
                        <label htmlFor="validationCustom03" className="form-label">Start Date</label>
                        <DatePicker className="form-control" id="validationCustom03"
                            selected={startDate}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            onChange={(date) => setStartDate(date)}
						/>
						
                        <div className="invalid-feedback">
                            Please provide a valid city.
                        </div>
                    </div>
					<div className="col-md-3">
						<label htmlFor="validationCustom03" className="form-label"> End Date </label>
                        <DatePicker className="form-control" id="validationCustom03"
                            selected={endDate}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            onChange={(date) => setEndDate(date)}
                        />

					</div>
                    <div className="col-md-3">
                        <label htmlFor="validationCustom05"  className="form-label">
                            Station
                        </label>
                        <select className="form-select" id="validationCustom04" value = {radarStation} onChange={(event) => setStation(event.target.value)} required>
                            <option defaultValue="ABC"> Select a station</option>
                            <option value = "ABC"> ABC</option>
							<option value = "ABC"> ABC</option>
							<option value = "ABC"> ABC</option>
							<option value = "ABC"> ABC</option>
                        </select>
                    </div>
                    <div className="col-md-2" style={{  justifyContent:"normal"}}>
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
