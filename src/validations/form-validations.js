import { errorMessages } from "../utils/constants";

export const validateName = (value) => {
  const regex = /^[a-zA-Z\s_]*$/;
  if (!regex.test(value)) {
    return errorMessages.invalidName;
  }
  return "";
};

export const validateEmail = (value) => {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!regex.test(value)) {
    return errorMessages.invalidEmail;
  }
  return "";
};

export const validateMobileNumber = (value) => {
  // const regex = /^[6-9]{1}[0-9]{9}$/;
  // if (!regex.test(value)) {
  //   return errorMessages.invalidMobileNumber;
  // }
  if (value && value.length === 10) {
    return "";
  }
  return errorMessages.invalidMobileNumber;
};
