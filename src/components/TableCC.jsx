import React from "react";
import {
  Table,
} from "react-bootstrap";
import "../App.css";
function TableCC({ lastAC }) {
    
  const getClaimName = (data) => {
    switch (data) {
      case "PG0090001":
        return "การดูแลรักษาในที่พัก (Home Isolation)";
      case "PG0060001":
        return "เข้ารับบริการรักษาทั่วไป (OPD/ IPD/ PP)";
      case "PG0080001":
        return "การดูแลรักษาในชุมชน (Community Isolation)";
      default:
        return data;
    }
  };

  const convertDateTime = (date) => {
    const dateTime = date.split("T");
    const date1 = dateTime[0].split("-");
    const time = dateTime[1].split(":");
    return `${date1[2]}/${date1[1]}/${date1[0]} เวลา ${time[0]}:${time[1]}น.`;
  };
  return (
    <div style={{ overflowX: "auto", display: 'block', whiteSpace:'nowrap'}}>
      <Table striped bordered hover size="xl">
        <thead>
          <tr>
            <th>#</th>
            <th>เข้ารับบริการ</th>
            <th>Claim Code</th>
            <th>รหัส รพ.</th>
            <th>วันที่ขอ Claim Code</th>
          </tr>
        </thead>
        <tbody>
          {lastAC.map((data, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{getClaimName(data.claimType)}</td>
              <td>{data.claimCode}</td>
              <td>{data.hcode}</td>
              <td>{convertDateTime(data.claimDateTime)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default TableCC;
