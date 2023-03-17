import React, { useState, useEffect } from "react";
import {
  Button,
} from "react-bootstrap";

import { FaPrint } from "react-icons/fa";
import "../App.css";
import ReactToPrint from "react-to-print";
// "homepage": "http://nhso-auth.udch.work/kiosk_1/",
import { ComponentToPrint } from "./ComponentToPrint";


function Print(props) {
  const componentRef = React.useRef(null);
  const onBeforeGetContentResolve = React.useRef(null);
  // const [text, setText] = React.useState("old boring text");

  React.useEffect(() => {
    if (typeof onBeforeGetContentResolve.current === "function") {
      onBeforeGetContentResolve.current();
    }
  }, [onBeforeGetContentResolve.current]);

  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);

  const reactToPrintTrigger = React.useCallback(() => {
    return (
      <Button variant="warning" style={{ marginTop: 10 }}>
        <FaPrint /> พิมพ์
      </Button>
    );
  }, []);

  return (
    <div>
      <ComponentToPrint ref={componentRef} pData={props.pData} hn={props.hn} hisName={props.hisName} />
      <ReactToPrint
        content={reactToPrintContent}
        trigger={reactToPrintTrigger}
      />
    </div>
  );
}

export default Print