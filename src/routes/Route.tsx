import React from "react";
import { Route } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

import Menu from "components/Layout/menu";

export default function RouteWrapper({
  component: Component,
  isAdmin,
  isApp = false,
  isStart = false,
  ...rest
}: any) {
  const mfi = () => {};
  return (
    <Route
      {...rest}
      render={(props) => (
        <>
          <Row>
            <Col className='px-0'>{!isStart && <Menu isStart={false} />}</Col>
          </Row>
          <main className='dash-page-content'>
            <div className={`app-container ${!isStart && "py-5"}`}>
              <Component {...props} mfiCall={mfi} />
            </div>
          </main>
        </>
      )}
    />
  );
}
