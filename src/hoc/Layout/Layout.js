import React from "react";
import { StyleRoot } from "radium";
import Navbar from "../../components/Navigation/Navbar/Navbar";
import Footer from "../../components/Navigation/Footer/Footer";

const Layout = (props) => {
  return (
    <StyleRoot className="height100">
      <Navbar />
      {props.children}
      <Footer />
    </StyleRoot>
  );
};

export default Layout;
