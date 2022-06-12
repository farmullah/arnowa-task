import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { errorMessages } from "../utils/constants";
import InputElement from "../componets/InputElement";
import {
  validateEmail,
  validateMobileNumber,
  validateName,
} from "../validations/form-validations";

const defaultValues = {
  name: "",
  email: "",
  mobileNumber: "",
};
const defaultErrors = {
  name: "",
  email: "",
  mobileNumber: "",
};

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(defaultValues);
  const [errors, setErrors] = useState(defaultErrors);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const error = validateField(name, value);
    return setErrors({
      ...errors,
      [name]: error,
    });
  };

  const validateField = (name, value) => {
    if (value === "") return errorMessages[name];
    switch (name) {
      case "name":
        return validateName(value);
      case "email":
        return validateEmail(value);
      case "mobileNumber":
        return validateMobileNumber(value);
      default:
        return false;
    }
  };

  const isValidated = () => {
    let validated = true;
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      const error = validateField(key, value);
      if (![null, undefined, ""].includes(error)) {
        validated = false;
      }

      newErrors[key] = error;
    });
    setErrors(newErrors);
    return validated;
  };

  const checkPastLogin = (userData) => {
    const adminData = {
      name: "admin",
      email: "admin@admin.com",
      mobileNumber: "0000000000",
    };

    const isAdmin =
      adminData.name === userData.name &&
      adminData.email === userData.email &&
      adminData.mobileNumber === userData.mobileNumber;

    const localUsers = JSON.parse(localStorage.getItem("loggedInUsers")) || [];
    const existingUser = localUsers.find(
      (user) =>
        user.name === userData.name ||
        user.email === userData.email ||
        user.mobileNumber === userData.mobileNumber
    );
    if (existingUser) {
      return true;
    }
    if (!isAdmin) localUsers.push(userData);
    localStorage.setItem("loggedInUsers", JSON.stringify(localUsers));
    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValidated()) {
      const user = {
        name: formData.name,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        loginTime: new Date(),
      };
      if (checkPastLogin(user)) {
        return alert("Please use different name, email or mobile number!");
      }
      localStorage.setItem("user", JSON.stringify(user));
      alert("Login success!");
      navigate("/home");
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) navigate("/home");
  }, []);

  return (
    <div className="login form__container flex flex-center align-center">
      <form
        method="post"
        autoComplete="off"
        onSubmit={handleSubmit}
        className="form"
      >
        <div className="flex align-center flex-column">
          <h2 className="form__title">Sign In</h2>
          <InputElement
            label="name"
            name="name"
            value={formData.name}
            error={errors.name}
            handleChange={handleChange}
            required
          />
          <InputElement
            label="email"
            name="email"
            type="email"
            value={formData.email}
            error={errors.email}
            handleChange={handleChange}
            required
          />
          <InputElement
            label="Mobile Number"
            name="mobileNumber"
            type="number"
            value={formData.mobileNumber}
            error={errors.mobileNumber}
            handleChange={handleChange}
            required
          />
          <input type="submit" className="submit__button" value="Login" />
        </div>
      </form>
    </div>
  );
};

export default Login;
