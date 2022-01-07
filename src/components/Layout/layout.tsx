import React from "react";
import { Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";

function Layout({ children,className="",cardClassName="py-4", pageClassName="" }) {
  return (
    <div className={`app-layout ${className}`}>
      <div className={`app-inner-page mx-4  ${pageClassName}`}>
        <Row className="justify-content-center">
          <Col xl={7} lg={7} md={7} sm={12} className={`card app-card  ${cardClassName}`}>
            {children}
          </Col>
        </Row>
      </div>
    </div>
  );
}
Layout.propTypes = {
  children: PropTypes.any,
};
export default Layout;
