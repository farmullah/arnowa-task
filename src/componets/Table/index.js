import React from "react";
import "./styles.css";

const Table = () => {
  const loggedInUsers = JSON.parse(localStorage.getItem("loggedInUsers")) || [];

  return (
    <div className="table">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile Number</th>
            <th>Response</th>
          </tr>
        </thead>
        <tbody>
          {loggedInUsers &&
            loggedInUsers.reverse().map((user) => {
              return (
                <tr key={user.email}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.mobileNumber}</td>
                  <td>{user.response}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
