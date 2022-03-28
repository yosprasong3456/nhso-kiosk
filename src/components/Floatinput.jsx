import React from "react";
import { Form, FloatingLabel } from "react-bootstrap";

function Floatinput({ label , value, setText, disabled = true, type = 'text'}) {
  return (
    <FloatingLabel
      controlId="floatingInput"
      label= {label}
      style={{ marginTop: 2 }}
    >
      <Form.Control
        type={type}
        placeholder=""
        value= {value}
        disabled= {disabled}
        onChange= {(e)=> setText(e.target.value)}
      />
    </FloatingLabel>
  );
}

export default Floatinput;
