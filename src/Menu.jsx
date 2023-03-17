import React from "react";
// import './index.css'
import "./menu.css";
import { Link } from "react-router-dom";
function Menu() {
  return (
    <div className="menu_body">
      <ul>
        <li>
          <Link to="/kiosk" data-text="Kiosk">
            Kiosk
          </Link>
        </li>

        <li>
          <Link to="/serene" data-text="Serene">
            Serene
          </Link>
        </li>

        <li>
          <Link data-text="VitalSign" to="/">
            VitalSign
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Menu;
