import React from "react";
import { Modal, Button } from "react-bootstrap";
import "../App.css";

function QRModal(props) {
  return (
    <div className="App">
      <Modal
        {...props}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        {/* <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title>
      </Modal.Header> */}
        <Modal.Body>
          <div style={{ textAlign: "center" }}>
            <img src={"/qrcode.png"} width={300} height={400} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>ปิด</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default QRModal;
