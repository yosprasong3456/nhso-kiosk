import * as React from "react";
import { Row, Col, Spinner, Button } from "react-bootstrap";
import Barcode from "react-barcode";
import QRCode from "react-qr-code";
import axios from "axios";
import { FaRedo } from "react-icons/fa";

import "../App.css";

export class ComponentToPrint extends React.PureComponent {
  interval = 0;
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      cData: null,
      loading: false,
      date: null,
    };
  }

  componentDidMount() {
    const { pData } = this.props;
    // this.myRef.current.Barcode()
    this.setState({ cData: null, data: null });
    this.getLastAC(pData.pid);
  }

  getLastAC(pid) {
    console.log(pid);
    this.setState({ loading: true });
    axios
      .get(
        `${process.env.REACT_APP_API_URL}api/nhso-service/latest-authen-code/${pid}`
      )
      .then((res) => {
        console.log(res);
        if (res.data.claimCode) {
          this.setState({
            cData: res.data.claimCode,
            date: res.data.claimDateTime,
          });
          this.setState({ loading: false });
        } else {
          this.setState({ cData: null, date: null });
          this.setState({ loading: false });
          // this.getLastAC()
        }
      }).catch((error)=>{
        console.log('err',error.response);
        const { status } = error.response
        if(status === 500){
          console.log('refunction')
          this.getLastAC(pid)
        }
      })
  }
  //   handleCheckboxOnChange = () =>
  //     this.setState({ checked: !this.state.checked });

  //   setRef = (ref) => (this.canvasEl = ref);
  calAge(age) {
    let aData = age.split(" ");
    return `${aData[0]} ${aData[1]}`;
  }
  calDate(data) {
    let date = data.split("T");
    let date1 = date[0].split("-");
    return `${date1[2]}/${date1[1]}/${date1[0]}`;
  }
  render() {
    const { pData, hn, hisName } = this.props;
    const { cData, loading, date } = this.state;
    // const data1 = this.getLastAC('1479900266077')
    return (
      <div style={{ paddingTop: 10, width: 500 }} className="AppFont">
        {/* <Container> */}
        <Row>
          <div style={{ width: 120 }}>
            {hn && (
              <>
                <Barcode value={hn} format="CODE128" height={20} width={1} />
              </>
            )}
          </div>
          <div style={{ textAlign: "left", width: 150 }}>
            {pData && (
              <div style={{ fontSize: 12 }}>
                <Col
                  style={{
                    width: "100%",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {`ชื่อ : ${hisName}`}
                </Col>
                <Col
                  style={{
                    width: "100%",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {`เพศ : ${pData.sex} อายุ : ${this.calAge(pData.age)}`}
                </Col>
                <Col
                  style={{
                    width: "100%",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  สิทธิ์ : {pData.mainInscl}
                </Col>
                {/* {cData && (
                  <Col style={{ width: '100%', overflow: 'hidden', whiteSpace:'nowrap',textOverflow:'ellipsis'}}>
                    <label>CC : {cData}</label>
                  </Col>
                )} */}
                {date && (
                  <Col
                    style={{
                      width: "100%",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <label>วันที่ : {this.calDate(date)}</label>
                  </Col>
                )}
              </div>
            )}
          </div>
          <div style={{ width: 100, padding: 0 }}>
            {cData ? (
              <Col>
                <QRCode value={hn} size={60} />
                <label style={{ fontSize: 12 }}>{cData}</label>
              </Col>
            ) : (
              loading && <Spinner animation="border" />
            )}
          </div>
          <div style={{ width: 70 }}>
            {!cData
              ? !loading && (
                  <Button
                    variant="warning"
                    onClick={() => this.getLastAC(pData.pid)}
                  >
                    <FaRedo />
                  </Button>
                )
              : null}
          </div>
        </Row>
        {/* </Container> */}
      </div>
    );
  }
}
