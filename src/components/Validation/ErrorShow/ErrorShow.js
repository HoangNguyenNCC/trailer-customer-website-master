import React from "react";
//Jusst display error in red
const ErrorShow = (props) => {
  return (
    <p
      className="text-danger bg-light mt-1 mb-2 text-center"
      style={{
        fontSize: "0.8rem",
      }}
    >
      {props.children}
    </p>
  );
};
export default ErrorShow;
