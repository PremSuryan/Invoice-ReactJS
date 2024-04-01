import React, { useState } from "react";
import LoginPage from "./loginpage";

const Register = () => {
  // State variables for form inputs
  const [username, setUsername] = useState("");
  const [userPhoneno, setPhoneno] = useState("");
  const [userAddress, setAddress] = useState("");
  const [userEmailID, setEmailID] = useState("");
  const [userCity, setUserCity] = useState("");
  const [userCountry, setCountry] = useState("");
  const [showRegister, setShowRegister] = useState(true);

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted with the following data:");
    console.log("Username:", username);
    console.log("Phone number:", userPhoneno);
    console.log("Address:", userAddress);
    console.log("Email ID:", userEmailID);
    console.log("City:", userCity);
    console.log("Country:", userCountry);
  };

  // Function to toggle back to LoginPage
  const toggleRegister = () => {
    setShowRegister(false); // Hide login form when toggling to Register
  };


  return (
    <form className="was-validated container container-sm-border" onSubmit={handleSubmit}>
         <div className="form-group" align="center">
                <br />
                <h1 style={{ textAlign: "center", color: "Blue" }}> Register Details </h1>
                <br />
                <label htmlFor="username"> Username: </label>
                <input type="text" className="form-control" id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your name" name="username" required />
            </div>
            <br />
            <div className="form-group" align="center">
                <label htmlFor="phoneno"> Phone number: </label>
                <input type="tel" className="form-control" id="phoneno" value={userPhoneno} onChange={(e) => setPhoneno(e.target.value)} placeholder="Enter your phone number" name="phoneno" required />
            </div>
            <br />
            <div className="form-group" align="center">
                <label htmlFor="address"> Address: </label>
                <input type="text" className="form-control" id="pwd" value={userAddress} onChange={(e) => setAddress(e.target.value)} placeholder="Enter your address" name="pwd" required />
            </div>
            <br />
            <div className="form-group" align="center">
                <label htmlFor="email"> EmailID: </label>
                <input type="text" className="form-control" id="pwd" value={userEmailID} onChange={(e) => setEmailID(e.target.value)} placeholder="Enter your emailID" name="pwd" required />
            </div>
            <br/>

            <div className="form-group" align="center">
                <label htmlFor="city"> City: </label>
                <input type="text" className="form-control" id="pwd" value={userCity} onChange={(e) => setUserCity(e.target.value)} placeholder="Enter your city" name="pwd" required />
            </div>
            <br/>

            <div className="form-group" align="center">
                <label htmlFor="country"> Country: </label>
                <input type="text" className="form-control" id="pwd" value={userCountry} onChange={(e) => setCountry(e.target.value)} placeholder="Enter your country" name="pwd" required />
            </div>
            <br/>


            <div className="form-group form-check" align="center">
                <input type="checkbox" className="form-check-input" id="checkbox" name="remember" required />
                <label className="form-check-label" htmlFor="checkbox">I agree to the terms and conditions</label>
                <br/>

                <button type="submit" className="btn btn-primary" onClick={toggleRegister}>Submit</button>
            </div>
            <br />
            {!showRegister && <LoginPage />}

    </form>
  );
}

export default Register;
