import React, { useState } from "react";
import "../styles/Registerlogin.css";
import Register from "../Components/Register";
import Login from "../Components/Login";
const Registerlogin = () => {
  const [show, setShow] = useState(false);
  return (
    <div className="Registerlogin">
      <div className="registerLgin-Content">
        <div className={show ? "imageanime1" : "imageanime"}>
          <img
            src="assets/logo.jpg"
            alt=""
          />
        </div>
        <div className="registerLgincontainer">
          <Login setShow={setShow} show={show} />
        </div>
        <div className="registerLgincontainer">
          <Register setShow={setShow} show={show} />
        </div>
      </div>
    </div>
  );
};

export default Registerlogin;
