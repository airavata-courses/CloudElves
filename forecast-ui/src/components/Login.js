import React, { useContext } from "react";
import { GoogleLogin } from "react-google-login";
import { Card } from "react-bootstrap";
import "../templates/login.css";
import { UserContext } from "./Context";

// This function handles Sign in with Google.
const Login = () => {
	
	const { setUser } = useContext(UserContext);
	async function onLoginSuccess(res) {

		console.log("Login Success!");
		const url = `http://${process.env.REACT_APP_gateway_host || "localhost"}:${process.env.REACT_APP_gateway_port || "8082"}/getUser`;
		await setUser({ "id_token": res.accessToken, "name": res.profileObj["givenName"], "email": res.profileObj["email"] });
		fetch(url, {
            method: "GET",
            headers: {
                "id_token": res.accessToken,
                "name": res.profileObj["givenName"],
                "email": res.profileObj["email"],
            }
        }).then(response => response.json())
            .then(response => (response))
            .catch(error => (error));
	}

	const onLoginFailure = (error) => {
	console.log("Login failed:", error);
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
				clientId={ process.env.REACT_APP_client_ID }
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
