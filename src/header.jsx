import React from "react";
import { useEffect, useState } from "react";
import "./index.css";
import { Button, Navbar, Container, Row } from "react-bootstrap";
import { useLocation, Link } from 'react-router-dom'
import { FcSearch, FcSurvey, FcRefresh } from "react-icons/fc";

function Header(props) {
  const [serene, setSerene] = useState(true)
  // const [kiosk, setKiosk] = useState(false)
  const location = useLocation();
  useEffect(() => {
    if(location.pathname === '/serene'){
      setSerene(false)
      console.log('GGW')
    }
    console.log(location.pathname);
  }, [])
  
  return (
    <Navbar
      className="AppFont"
      expand="lg"
      variant="light"
      style={{ backgroundColor: "#0d6efd" }}
    >
      <Container>
      
        <Navbar.Brand href="#" style={{ color: "white" }}>
          <Link to="/" style={{color:'#fff'}}>
          <img alt="" src="udch.png" width="60" height="60" />{" "}
            โรงพยาบาลมะเร็งอุดรธานี
          </Link>
        </Navbar.Brand>
        
        <div>
          <Button
            variant="warning"
            style={{ marginTop: 0 }}
            onClick={() => window.location.reload(false)}
          >
            <FcRefresh />
            Reload 
          </Button>
          { serene ? 
          <Link to="/serene">
            <Button
              variant="danger"
              style={{ marginTop: 0, marginLeft:10 }}
            >
              <FcSearch/>
              Serene HN
            </Button>
          </Link> : 
          <Link to="/kiosk">
          <Button
            variant="success"
            style={{ marginTop: 0, marginLeft:10 }}
          >
            <FcSurvey/>
            Kiosk
          </Button>
        </Link>}
          
        </div>
      </Container>
    </Navbar>
  );
}

export default Header;
