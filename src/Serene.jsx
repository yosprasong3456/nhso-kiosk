import React, { useState, useEffect } from "react";
import Header from "./header";
import "./index.css";
import axios from "axios";
import { Container,Table, Row, Card, Col, Form, Button } from "react-bootstrap";
import Footer from "./footer";

const personDataSet = () => {
  const dataSet = { pid: "", fname: "", lname: "" };
  return dataSet;
};
function Serene() {
  const [type, setType] = useState(false);
  const [cardStatus, setCardStatus] = useState(false);
  const [person, setPerson] = useState(personDataSet);
  const [listPerson, setListPerson] = useState(null)
  const [noData, setNoData] = useState(false)
  useEffect(async () => {
    const cardStat = async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}api/smartcard/terminals`
      );
      if (data.length > 0) {
        setCardStatus(data[0].isPresent);
        // console.log('card',data);
        // console.log('type',type)
      }
    };
    if (cardStatus) {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}api/smartcard/read-card-only?readImageFlag=false`
        );
        // console.log(data)
        setPerson(data);
      } catch (error) {
        setPerson(personDataSet);
      }
    } else {
      setPerson(personDataSet);
    }
    // ------------------------------------------

    const interval = setInterval(async () => {
      cardStat(); //
    }, 2000);
    return () => clearInterval(interval);
  }, [cardStatus]);

  const sentData = async () => {
    setNoData(false)
    const dataSent = {
      "cid" : person.pid,
      "fname": person.fname,
      "lname": person.lname
    }
    const result = await axios.post(
      `https://iot.udch.work:8888/serene_test.php`, dataSent
    );
    if(result.data.message === 'success'){
      if(result.data.data.length > 0){
        setListPerson(result.data.data)
        setNoData(false)
      }
    }else{
      setNoData(true)
      setListPerson(null)
    }
    console.log(result);
  };

  const resetParams = () => {
    console.log("reset params");
    setPerson(personDataSet);
  };

  return (
    <div className="AppFont">
      <Header />
      <div style={{ marginTop: 20 }}>
        <h1 style={{ textAlign: "center", fontWeight: "bold" }}>
          ค้นหา HN Serene
        </h1>
      </div>

      <Container fluid="lg">
        <Card style={{ margin: 20 }}>
          <Card.Header as="h5">เลือกประเภทการค้นหา</Card.Header>
          <Card.Body>
            {/* <Row> */}
            <Col>
              <Form.Check
                inline
                label="บัตรประชาชน"
                name="group1"
                type="radio"
                id={`inline-radio-1`}
                checked={type === false}
                onChange={() => setType(!type)}
              />
              {!type && (
                <Row>
                  <Col sm={3}>
                    <p style={{ padding: 5, marginLeft: 25 }}>
                      เสียบบัตรประชาชน
                    </p>
                  </Col>
                  <Col sm={3}>
                    {cardStatus ? (
                      <Button
                        style={{ fontWeight: "bold" }}
                        variant="warning"
                        onClick={() => sentData()}
                      >
                        🔍ค้นหา
                      </Button>
                    ) : (
                      <label
                        style={{
                          backgroundColor: "#FA8190",
                          borderRadius: 5,
                          padding: 5,
                        }}
                      >
                        ไม่พบบัตรประชาชน
                      </label>
                    )}
                  </Col>
                </Row>
              )}
            </Col>
            <Col>
              <Form.Check
                inline
                label="ชื่อ-นาสกุล หรือ เลขบัตรประชาชน"
                name="group1"
                type="radio"
                id={`inline-radio-1`}
                checked={type === true}
                onChange={() => setType(!type)}
              />
              {type && (
                <Row style={{ padding: 10 }}>
                  <Col sm={3}>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Control
                        type="text"
                        placeholder="เลขบัตรประชาชน"
                        value={person.pid}
                        onChange={(e) =>
                          setPerson({ ...person, pid: e.target.value })
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={3}>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Control
                        type="text"
                        placeholder="ชื่อ"
                        value={person.fname}
                        onChange={(e) =>
                          setPerson({ ...person, fname: e.target.value })
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={3}>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Control
                        type="text"
                        placeholder="นามสกุล"
                        value={person.lname}
                        onChange={(e) =>
                          setPerson({ ...person, lname: e.target.value })
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={3} style={{ textAlign: "center" }}>
                    <Button
                      style={{ fontWeight: "bold" }}
                      variant="warning"
                      onClick={() => sentData()}
                    >
                      🔍ค้นหา
                    </Button>
                    <Button
                      style={{ fontWeight: "bold", marginLeft: 10 }}
                      variant="primary"
                      onClick={() => resetParams()}
                    >
                      🔃รีเซ็ต
                    </Button>
                  </Col>
                </Row>
              )}
            </Col>
            {/* </Row> */}
          </Card.Body>
        </Card>

        <Card style={{ margin: 20 }}>
          <Card.Header as="h5">ข้อมูลผู้รับบริการ</Card.Header>
          <Card.Body>

            <div style={{ overflowX: "auto", display: 'block', whiteSpace:'nowrap'}}>
      <Table striped bordered hover size="xl">
        <thead>
          <tr>
            <th>#</th>
            <th>HN senene</th>
            <th>ชื่อ-นามสกุล</th>
            <th>เลขบัตรประชาชน</th>
            <th>วันเกิด</th>
            {/* <th>วันที่ขอ Claim Code</th> */}
          </tr>
        </thead>
        <tbody>
        {listPerson && listPerson.map((data, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{data.HN_NO}</td>
              <td>{data.HN_FIRST_NAME} {data.HN_LAST_NAME}</td>
              <td>{data.HN_ID_NO}</td>
              <td>{data.HN_BIRTHDAY}</td>
            </tr>
          ))
        
        }
        </tbody>
      </Table>
      {noData && <h3 style={{textAlign:'center'}}>ไม่พบข้อมูล</h3>}
    </div>
          </Card.Body>
        </Card>
      </Container>
      <Footer/>
    </div>
  );
}

export default Serene;
