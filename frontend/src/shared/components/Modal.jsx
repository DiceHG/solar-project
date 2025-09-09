import React from "react";

import "./Modal.css";

const Modal = (props) => {
  return (
    <div>
      <div className="backdrop" onClick={props.closeModal}></div>
      <div className="modal">
        <button onClick={props.closeModal}>Fechar</button>
        {props.children}
      </div>
    </div>
  );
};

export default Modal;
