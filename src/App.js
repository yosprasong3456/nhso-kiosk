import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Navbar,
  Container,
  Row,
  Col,
  Card,
  Spinner,
  // Form,
  // InputGroup,
  // FloatingLabel,
  Image,
  // Table,
  Modal,
} from "react-bootstrap";
// import { GrPowerReset } from "react-icons/gr";
import { FaPrint, FaRedo } from "react-icons/fa";
import "./App.css";
// import ReactToPrint from "react-to-print";
// "homepage": "http://nhso-auth.udch.work/kiosk_1/",
// import { ComponentToPrint } from "./components/ComponentToPrint";
import Floatinput from "./components/Floatinput";
import TableCC from "./components/TableCC";
import Header from "./header";
import Footer from "./footer";
import  Print  from "./components/Print";
import QRModal from './components/QRModal'

//"homepage": "https://nhso-auth.udch.work/",

function dateNow(){
  let d = new Date();
  let day = d.getDate()
  let month = d.getMonth() + 1
  let year = d.getFullYear()
  if(month < 10){
    month = '0'+month 
  }
  return `${year}-${month}-${day}`
}

function textSplit(params, code = 0){
  const a = params.split("(")
  const b = a[1].split(")")
  if(code){
    return b[0]
  }else{
    let c = params.split(" ")
    c.shift()
    return c.join(' ')
  }
}

function postToHIS(params, code, hn = '' , mainInscl, subInscl, mainInsclName, subInsclName){
  
  const data = {
    "ac_id": "",
    "ac_pid": params.pid,
    "ac_code": code,
    "ac_type": params.claimType,
    "ac_date": dateNow(),
    "ac_hn": hn,
    "ac_main_insr": mainInscl,
    "ac_sub_insr": subInscl,
    "ac_main_name": mainInsclName,
    "ac_sub_name": subInsclName
  }

  console.log(data)
  axios
    .post(
      `${process.env.REACT_APP_API_HIS}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_API_HIS_KEY}`,
        },
      }
    )
    .then((res) => {
      console.log("res", res);
      return true
    }).catch((error) => {
      console.log(error);
      return false
  })
}

function App() {
  //state
  const [hnModal, setHnModal] = useState(false);
  const [modalPrint, setModalPrint] = useState(false);
  const [personData, setPersonData] = useState(null);
  const [Loading, setLoading] = useState(false);
  const [cardStatus, setCardStatus] = useState(false);
  const [claimCheck, setClaimCheck] = useState("PG0060001");
  const [cellPhone, setCellPhone] = useState("");
  const [lastAC, setLastAC] = useState(null);
  const [show, setShow] = useState(false);
  const [modalText, setModalText] = useState("");
  const [loadAC, setLoadAC] = useState(false);
  const [hn, setHn] = useState("");
  const [codeStatus, setCodeStatus] = useState("")
  const [hisName, setHisName] = useState('')
  const [cardOnly, setCardOnly] = useState(null)
  const printtRef = React.useRef(null);
  const [qrShow, setQrShow] = useState(false)

  useEffect(() => {
    const interval = setInterval(async () => {
      cardStat(); 
    }, 2000);
    return () => clearInterval(interval);
  }, [cardStatus]);

  useEffect(() => {
    const getPatient = async () => {
      if (personData === null) {
        setLoading(true);
        setCodeStatus('')
        try {
          const { data } = await axios.get(
            `${process.env.REACT_APP_API_URL}api/smartcard/read?readImageFlag=true`
          );
          if (data !== null) {
            const cardRead = await axios.get(
              `${process.env.REACT_APP_API_URL}api/smartcard/read-card-only?readImageFlag=false`
            );
            console.log('card', cardRead.data)
            setPersonData(data);
            setCardOnly(cardRead.data)
            getLastAC(data.pid);
            getHn(data.pid);
            setLoading(false);
          }
          setLoading(false);
          // const {mainInscl, subInscl} = data
          // console.log(textSplit(subInscl))
          return data;
        } catch (error) {
          console.log(error.response)
          const { status } = error.response
          if(status === 500){
            setCodeStatus('ไม่พบข้อมูลจาก Server')
            setLoading(false);
          }
        }
       
        // if (data !== null) {
        //   setPersonData(data);
        //   getLastAC(data.pid);
        //   getHn(data.pid);
        //   setLoading(false);
        // }
        // setLoading(false);
        // console.log(data);
        // return data;
      } else {
        setLoading(false);
        // return personData;
      }
    };

    if (cardStatus) {
      getPatient();
      // SetText({setFirst})
    } else {
      console.log("no card");
      setPersonData(null);
      setLastAC(null);
      setLoading(false);
      setHn("");
      setHisName("")
      setCardOnly(null)
      setModalPrint(false)
      setShow(false)
      setCellPhone("")
    }
  }, [cardStatus, personData]);

  const cardStat = async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_URL}api/smartcard/terminals`
    );
    if (data.length > 0) {
      setCardStatus(data[0].isPresent);
      // console.log(data)
    }
  };

  const getHN1 = async (params) =>{
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_LOCAL}/getPerson.php?cid=${params}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
        },
      }
    ); 
    if(data.message === 'success'){
      console.log('getHN1',data.data)
      const { hn, phone, fullname } = data.data
      setHn(hn)
      setCellPhone(phone)
      setHisName(fullname)
    }
  }

  const getHn = async (params) => {
   
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_HIS_PERSON}${params}&_count=1`,
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_API_HIS_KEY}`,
          },
        }
      );

      if (data.length > 0) {
        const { name } = data[0];
        setHisName(`${name[0].given[0]} ${name[0].family}`)
        const { identifier } = data[0];
        identifier.map((data1) => {
          if (
            data1.system === "https://www.thaihis.org/terminology/identifier/hn"
          ) {
            setHn(data1.value);
            return data1.value;
          }
          return 0;
        });
        const { telecom } = data[0];
        telecom.map((tele) => {
          if (tele.system === "phone") {
            let phoneNum = tele.value.split("-");
            setCellPhone(`${phoneNum[0]}${phoneNum[1]}${phoneNum[2]}`);
            let phoneResult = ''
            for(let i = 0; i< phoneNum.length; i++){
              phoneResult += phoneNum[i]
            }
            console.log('phone = ', phoneResult)
            return phoneResult;
          }
          return 0;
        });
      }else{
        getHN1(params);
      }
    } catch (error) {
      console.log(error)
      getHN1(params);
    }
    
  };

  const sentData = () => {
    const data = {
      pid: personData.pid,
      claimType: claimCheck,
      mobile: cellPhone,
      correlationId: personData.correlationId,
      hn: hn,
    };
    console.log('sent',data);
    if (!hn) {
      return setHnModal(true);
    }
    if (data.mobile.length === 10) {
      setShow(true);
      try {
        axios
          .post(
            `${process.env.REACT_APP_API_URL}api/nhso-service/confirm-save`,
            data
          )
          .then((res) => {
            console.log("res", res);
            setModalText("คุณขอ AuthenCode สำเร็จ " + res.data.claimCode);
            getLastAC(data.pid);
            postToHIS(data, res.data.claimCode, hn, textSplit(personData.mainInscl, 1), 
                      textSplit(personData.subInscl, 1), textSplit(personData.mainInscl), 
                      textSplit(personData.subInscl))
          }).catch((error) => {
            console.log(error.response);
            setModalText("วันนี้คุณขอ AuthenCode แล้ว");
        })
      } catch (error) {
        console.error(error);
        // setShow(true);
        setModalText("คุณขอ AuthenCode ไม่สำเร็จ");
        // setLoading(false);
      }
      // alert(JSON.stringify(data));
    } else {
      setShow(true);
      setModalText("ตรวจสอบเบอร์โทรศัพท์");
    }
  };

  const getLastAC = (data = "") => {
    setLoadAC(true);
    try {
      axios
        .get(
          `${process.env.REACT_APP_API_URL}api/nhso-service/latest-5-authen-code-all-hospital/${data}`
        )
        .then(
          (res) => {
            console.log(res.data);
            setLastAC(res.data);
            setLoadAC(false);
          },
          (reason) => {
            console.log(reason);
            setLoadAC(false);
          }
        );
    } catch (error) {
      console.error(error);
      setLoadAC(false);
    }
  };

  const closeModal = () => {
    setShow(false);
    setModalText(null);
  };
  return (
    <div className="AppFont">
      <Header />
      {/* <Navbar
        expand="lg"
        variant="light"
        style={{ backgroundColor: "#0d6efd" }}
      >
        <Container>
          <Navbar.Brand href="#" style={{ color: "white" }}>
            <img alt="" src="udch.png" width="60" height="60" />{" "}
              โรงพยาบาลมะเร็งอุดรธานี
          </Navbar.Brand>
          <>
          <Button
            variant="warning"
            style={{ marginTop: 0 }}
            onClick={() => window.location.reload(false)}
          >
            Reload <FaRedo />
          </Button>
          </>
          
        </Container>
      </Navbar> */}
      <Container fluid="lg">
        <Card style={{ margin: 20 }}>
          <Card.Header as="h5">
            ตรวจสอบและยืนยันการเข้ารับบริการขอ Claim Code
          </Card.Header>
          <Card.Body>
            <Row>
              <Col xs={12} md={4} sm={6} style={{padding:10}}>
                <label style={{ padding: 5 }}>
                  {" "}
                  สถานะ :{" "}
                  {cardStatus ? (
                    <label
                      style={{
                        backgroundColor: "#B8E986",
                        borderRadius: 5,
                        padding: 5,
                      }}
                    >
                      อ่านบัตร
                    </label>
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
                </label>
              </Col>
              <Col style={{padding: 15}}>{codeStatus && <label
                      style={{
                        backgroundColor: "#FA8190",
                        borderRadius: 5,
                        padding: 5
                      }}
                    >
                      {codeStatus}
                      
                    </label>}</Col>
                    <Col style={{padding: 15}}><Button onClick={()=>setQrShow(true)}>📱 QR-code</Button></Col>
            </Row>
            
          </Card.Body>
        </Card>
        {personData ? (
          <>
            <Card style={{ margin: 20 }}>
              <Card.Header as="h5">ข้อมูลรายละเอียดบุคคล</Card.Header>
              <Card.Body>
                <Row>
                  <Col xs={12} md={3} style={{ textAlign: "center" }}>
                    {personData.image ? (
                      <Image
                        src={`data:image/jpeg;base64,${personData.image}`}
                      />
                    ) : (
                      <Image
                        src="https://his-storage.udch.work/images/nouser.png"
                        style={{ width: 150, height: 150 }}
                      />
                    )}
                  </Col>

                  {personData && (
                    <>
                      <Col xs={12} md={4}>
                        <Floatinput label="เลขบัตรประชาชน" value={personData.pid}/>
                        <Floatinput label="ชื่อ - นามสกุล" value={cardOnly ? `${cardOnly.fname} ${cardOnly.lname}` : `${personData.fname} ${personData.lname}`}/>
                        <Floatinput label="เพศ" value={personData.sex}/>
                      </Col>
                      <Col xs={12} md={5}>
                        <Floatinput label="อายุ" value={personData.age}/>
                        <Floatinput label="สิทธิหลัก" value={personData.mainInscl}/>
                        <Floatinput label="สิทธิย่อย" value={personData.subInscl}/>
                      </Col>
                    </>
                  )}
                </Row>
              </Card.Body>
            </Card>
          </>
        ) : Loading ? (
          <div style={{ textAlign: "center" }}>
            {" "}
            <Spinner animation="border" />
          </div>
        ) : null}

        {personData ? (
          <>
            <Card style={{ margin: 20 }}>
              <Card.Header as="h5">ข้อมูลการเข้ารับบริการ</Card.Header>
              <Card.Body>
                {Loading ? (
                  <Spinner animation="border" />
                ) : personData ? (
                  <Row>
                    <Col xs={12} md={6}>
                    <Floatinput label="HN" value={hn}/>
                    <Floatinput label="เบอร์โทรศัพท์มือถือ" value={cellPhone} type={'number'} setText={setCellPhone} disabled={false}/>
                      {/* <FloatingLabel
                        controlId="floatingInput"
                        label="HN"
                        style={{ marginTop: 2 }}
                      >
                        <Form.Control
                          type="text"
                          placeholder="HN"
                          value={hn}
                          onChange={(e) => console.log(e.target.value)}
                          disabled
                        />
                      </FloatingLabel> */}

                      {/* <FloatingLabel
                        controlId="floatingInput"
                        label="เบอร์โทรศัพท์มือถือ"
                      >
                        <Form.Control
                          type="number"
                          placeholder="เบอร์โทรศัพท์มือถือ"
                          value={cellPhone}
                          onChange={(e) => setCellPhone(e.target.value)}
                        />
                      </FloatingLabel> */}
                    </Col>
                    <Col xs={12} md={6}>
                      {personData.claimTypes.map((data, i) => (
                        <div className="radio" key={i} style={{ margin: 2 }}>
                          <label style={{ cursor: "pointer" }}>
                            <input
                              style={{ cursor: "pointer" }}
                              type="radio"
                              value={data.claimType}
                              checked={claimCheck === data.claimType}
                              onChange={(e) => setClaimCheck(e.target.value)}
                            />{" "}
                            {data.claimTypeName}
                          </label>
                        </div>
                      ))}
                      <Col
                        style={{ textAlign: "center" }}
                        className="d-grid gap-2"
                      ></Col>
                    </Col>
                  </Row>
                ) : null}
                <Col
                  style={{ textAlign: "center", marginTop: 10 }}
                  className="d-grid gap-2"
                >
                  <Button style={{ marginTop: 0 }} onClick={() => sentData()}>
                    ขอ Claim Code
                  </Button>
                </Col>
              </Card.Body>
            </Card>
          </>
        ) : null}
        {loadAC ? (
          <div style={{ textAlign: "center" }}>
            {" "}
            <Spinner animation="border" />
          </div>
        ) : personData && lastAC ? (
          <Card style={{ margin: 20 }}>
            <Card.Header as="h5">
              Claim Code ล่าสุด{" "}
              <Button
                variant="warning"
                style={{ marginTop: 0 }}
                onClick={() => setModalPrint(true)}
              >
                <FaPrint /> พิมพ์
              </Button>
            </Card.Header>
            <Card.Body>
              {lastAC && <TableCC lastAC={lastAC} />}
              <Card.Title></Card.Title>
            </Card.Body>
          </Card>
        ) : null}

        {/* <Modal
          size="lg"
          show={show}
          onHide={() => setShow(false)}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Body style={{ textAlign: "center" }}>
            {modalText ? (
              <>
                {modalText}
                {modalText !== "ตรวจสอบเบอร์โทรศัพท์"
                  ? lastAC && <Print pData={personData} hn={hn} />
                  : null}
              </>
            ) : (
              <div style={{ textAlign: "center" }}>
                {" "}
                <Spinner animation="border" />
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => closeModal()}>
              ปิด
            </Button>
          </Modal.Footer>
        </Modal> */}

        <Modal
          // size="lg"
          show={modalPrint}
          onHide={() => setModalPrint(false)}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Body style={{ textAlign: "center" }}>
            {lastAC && <Print ref={printtRef} pData={personData} hn={hn} hisName={hisName} />}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setModalPrint(false)}>
              ปิด
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          // size="lg"
          show={show}
          onHide={() => setShow(false)}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Body style={{ textAlign: "center" }}>
            {modalText ? (
              <>
                {modalText}
                {modalText !== "ตรวจสอบเบอร์โทรศัพท์"
                  ? lastAC && <Print pData={personData} hn={hn} hisName={hisName}/>
                  : null}
              </>
            ) : (
              <div style={{ textAlign: "center" }}>
                {" "}
                <Spinner animation="border" />
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => closeModal()}>
              ปิด
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          // size="lg"
          show={hnModal}
          onHide={() => setHnModal(false)}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Body style={{ textAlign: "center" }}>
            {"ติดต่อเวชระเบียน"}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setHnModal(false)}>
              ปิด
            </Button>
          </Modal.Footer>
        </Modal>
        <QRModal show={qrShow}
        onHide={() => setQrShow(false)}/>
      </Container>
      <Footer />
    </div>
  );
}

export default App;
