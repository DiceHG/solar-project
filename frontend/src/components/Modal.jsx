import React from "react";

import "./Modal.css";

const Modal = (props) => {
  return (
    <>
      <div className="backdrop" onClick={props.onClose}></div>
      <div className={`modal ${props.className}`}>
        <header>{props.header}</header>
        <div>{props.children}</div>
        <footer>{props.footer}</footer>
      </div>
    </>
  );
};

export default Modal;
