import React from "react";
import { Container } from "react-bootstrap";
import colorStyles from "../style/color.module.css";

type LayoutProps = {
  header?: React.ReactNode;
  navBar?: React.ReactNode;
  settingBar?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ header, settingBar, children }) => (
  <Container fluid className="overflow-hidden">
    {header}
    <div className={[colorStyles.lightTheme, "position-relative z-1 h-100"].join(" ")}>
      <div className="h-100">{children}</div>
      <div className="position-absolute top-0 end-0">{settingBar}</div>
    </div>
  </Container>
);

export default Layout;
