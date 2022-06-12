import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InputElement from "../componets/InputElement";
import Table from "../componets/Table";
import "../styles/home.css";

const Home = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [timeRemaining, setTimeRemaining] = useState("");
  const [response, setResponse] = useState("");
  const [responseError, setResponseError] = useState("");

  //admin check
  const adminData = {
    name: "admin",
    email: "admin@admin.com",
    mobileNumber: "0000000000",
  };

  const isAdmin =
    user.name === adminData.name &&
    user.email === adminData.email &&
    user.mobileNumber === adminData.mobileNumber;

  //logout
  const logout = () => {
    localStorage.removeItem("user");
    clearInterval();
    clearTimeDifferenceInterval();
    navigate("/login", { replace: true });
  };

  // get the login time
  const getLoginTime = () => {
    const date = new Date(user.loginTime);
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return { date, minutes, seconds };
  };

  //find future date by adding 10 minutes to the login time
  const getExpiryTime = () => {
    const { date } = getLoginTime();
    const expiryTime = 10; //in minutes
    const expiryDate = new Date(
      new Date().setTime(date.getTime() + expiryTime * 60 * 1000)
    );
    const expiryMinutes = expiryDate.getMinutes();
    const expirySeconds = expiryDate.getSeconds();

    return { expiryDate, expiryMinutes, expirySeconds };
  };

  //get the  current date
  const getCurrentTime = () => {
    const currentDate = new Date();
    const currentMinutes = currentDate.getMinutes();
    const currentSeconds = currentDate.getSeconds();
    return { currentDate, currentMinutes, currentSeconds };
  };

  //find the difference between expiry date and current date
  const findTimeDifference = () => {
    const { currentDate } = getCurrentTime();
    const { expiryDate } = getExpiryTime();

    const minutesDiff = parseInt(
      (Math.abs(expiryDate.getTime() - currentDate.getTime()) / (1000 * 60)) %
        60
    );

    const secondsDiff = parseInt(
      (Math.abs(expiryDate.getTime() - currentDate.getTime()) / 1000) % 60
    );

    const difference = `${minutesDiff} : ${secondsDiff}`;
    return { difference, minutesDiff, secondsDiff };
  };

  const clearTimeDifferenceInterval = () => {
    clearInterval(differenceTimeInterval);
  };

  //start the session
  const startSessions = () => {
    const { minutesDiff, secondsDiff } = findTimeDifference();

    if (minutesDiff === 0 && secondsDiff === 0) {
      clearTimeInterval();
      clearTimeDifferenceInterval();
      logout();
    }
  };

  //session interval - it run in every 1 seconds for logout purpose
  const interval = setInterval(startSessions, 1000);

  const clearTimeInterval = () => {
    clearInterval(interval);
  };

  //time difference interval - it run in every 5 seconds for showing differences purpose
  const differenceTimeInterval = setInterval(() => {
    const { difference } = findTimeDifference();
    setTimeRemaining(difference);
  }, 5000);

  //New response message
  const handleChange = (e) => {
    const { value } = e.target;
    setResponse(value);
    if (value === "") {
      setResponseError("Please enter the message...");
    } else {
      setResponseError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const loggedInUsers =
      JSON.parse(localStorage.getItem("loggedInUsers")) || [];

    const updatedLoggedInUsers = loggedInUsers.map((u) => {
      if (
        u.name === user.name ||
        u.email === user.email ||
        u.password === user.password
      ) {
        u.response = response;
      }
      return u;
    });
    localStorage.setItem("loggedInUsers", JSON.stringify(updatedLoggedInUsers));
    alert("Your response has been submitted successfully!");
    logout();
  };

  useEffect(() => {
    if (!user) {
      return navigate("/login");
    }
    const { difference } = findTimeDifference();
    setTimeRemaining(difference);
  }, []);

  return (
    <div className="home">
      <div className="navbar">
        <section className="container">
          <h4>Welcome : {user.name}</h4>
          <div className="middle-section align-center">
            <h1>{timeRemaining}</h1>
          </div>
          <p onClick={logout} title="log out" className="btnLogout">
            Logout
          </p>
        </section>
      </div>
      {isAdmin ? (
        <Table />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="home-content flex flex-column"
          autoComplete="off"
          method="post"
        >
          <InputElement
            name="response"
            handleChange={handleChange}
            value={response}
            inputType="textarea"
            placeholder="Enter your message..."
            rows={5}
            error={responseError}
          />
          <input type="submit" className="submit__button" value="Submit" />
        </form>
      )}
    </div>
  );
};

export default Home;
