var style = {
  backgroundColor: "#F4FBFF",
  height: 80,
  position: "relative",
};

var phantom = {
  textAlign: "center",
  top: "50%",
  transform: "translateY(-50%)",
  position: "relative",
  //   backgroundColor: "#F4FBFF"
};
// 0.0.1 
// 0.0.2 เพิ่ม reload เพิ่ม component
// 0.0.3  Connect To HIS
function Footer() {
  return (
    <footer style={style}>
      <p style={phantom}>Version : 0.0.3</p>
    </footer>
  );
}

export default Footer;
