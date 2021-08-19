/* Props:
  state : entire state object having form values and errors
  name: name of field
  text : value of field
  */

const errorPopulator = (state, name, value) => {
  const errors = state.errors;
  //regex for email, password mobile and empty fields
  switch (name) {
    case "email":
      const emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
      if (!emailRegex.test(value)) {
        errors["email"] = "please enter a valid email";
      } else {
        delete errors["email"];
      }
      break;
    case "password":
      if (value.length < 8) {
        errors["password"] = "password should be atleast 8 characters long";
        break;
      } else {
        delete errors["password"];
      }
      const countUppercase = (value.match(/[A-Z]/g) || []).length;
      const countLowercase = (value.match(/[a-z]/g) || []).length;
      const countNumbers = (value.match(/\d/g) || []).length;
      const countSymbols =
        value.length - countUppercase - countLowercase - countNumbers;
      if (
        [countUppercase, countLowercase, countSymbols, countNumbers].some(
          (elem) => {
            return elem < 1;
          }
        )
      ) {
        errors["password"] =
          "password should have atleast one lowercase, one uppercase, one symbol and one numeric character";
      } else {
        delete errors["password"];
      }
      break;
    case "confirmPassword":
      if (value !== state.password) {
        errors[name] = "passwords should match";
      } else {
        delete errors[name];
      }
      break;
    case "mobile":
      const mobileRegex = /^(\+\d+)?\d+$/;
      if (!mobileRegex.test(value)) {
        errors["mobile"] = "invalid mobile number";
      } else {
        delete errors["mobile"];
      }
      break;

    default:
      if (value.trim() === "") {
        errors[name] = `${name} can't be empty`;
      } else {
        delete errors[name];
      }
  }
  return errors;
};

export default errorPopulator;
