import React, { useContext } from "react";
import { GoogleLogin } from "react-google-login";
import { Card } from "react-bootstrap";
import "../templates/login.css";
import { UserContext } from "./Context";

const Login = () => {
	const {setUser} = useContext(UserContext);
	const onLoginSuccess = async (res) => {
	console.log("Login Success:", res);
	await setUser({"id_token":res.accessToken, "name":res.profileObj["givenName"], "email":res.profileObj["email"]});
	};

	const onLoginFailure = (error) => {
	console.log("Login failed:",error);
	};

  	return (
    <div>
      	<Card className="g-signin" style={{ width: "25rem" }}>
        <Card.Body>
        	<Card.Title style={{ textAlign: "center" }}>
            	Welcome to Cloud Weather App!
          	</Card.Title>
          	<Card.Text style={{ textAlign: "center" }}>
            	Please sign in here to continue.
          	</Card.Text>

          	<GoogleLogin
				clientId={process.env.REACT_APP_client_ID}
				buttonText="Sign In"
				onSuccess={onLoginSuccess}
				onFailure={onLoginFailure}
				cookiePolicy={"single_host_origin"}
				isSignedIn={true}
			/>
        </Card.Body>
    	</Card>
    </div>
  	);
};

export default Login;
