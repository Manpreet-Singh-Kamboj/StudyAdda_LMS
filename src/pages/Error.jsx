import React from "react";
import ErrorSVG from "../assets/Images/404error.svg";
const Error = () => {
  return (
    <div className="flex flex-col justify-center h-screen items-center text-3xl text-white">
      <img
        src={ErrorSVG}
        width={350}
        height={350}
        className="object-contain"
        alt="Error"
      />
      <h1>Page Not Found</h1>
    </div>
  );
};

export default Error;
