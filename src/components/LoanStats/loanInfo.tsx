import React, { useEffect } from "react";
import { Modal, Row, Col, Spinner } from "react-bootstrap";

import strings from "localization";

import bankIcon from "Assets/Images/icons/bank.png";
/**
 * this shared function using to display the selected loan fund and repay
 * set loan data which exist in home tabs
 */

function LoanInfo({ loanData }: {
  loanData: any
}) {
  const totalFunded = loanData.totalFunded;
  const totalRepaid = loanData.totalRepaid;

  useEffect(() => {
    (async () => {
      const language: any = localStorage.getItem("language");
      if (language) {
        strings.setLanguage(language);
      }
    })();
  }, []);

  return (
    <Row className='justify-content-center app-inner-page app-inner-page-tab'>
      <Col xl={12} lg={12} md={12} sm={12} className='card app-card'>
        <div className='app-card-title d-flex align-self-center mt-3 justify-content-center'>
          <h3>{strings.loanInformation}</h3>
        </div>
        <Row>
          <Col className='align-self-center text-left'>
            <p className='my-2 app-label-with-icon'>
              <img src={bankIcon} alt='bank' />
              <span className='pl-1 mb-2'>{strings.totalFunded}</span>
            </p>
          </Col>
          <Col className='align-self-center text-right col-auto'>
            <span className='app-text-blue font-weight-bolder mr-1'>
              {totalFunded}
            </span>
            <span className='app-currency-label'>$</span>
          </Col>
        </Row>
        <Row>
          <Col className='align-self-center text-left'>
            <p className='app-label-with-icon'>
              <img src={bankIcon} alt='bank' />
              <span className='pl-1 mb-2'>{strings.totalRepaid}</span>
            </p>
          </Col>
          <Col className='align-self-center text-right col-auto'>
            <span className='app-text-blue font-weight-bolder mr-1'>
              {totalRepaid}
            </span>
            <span className='app-currency-label'>$</span>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
export default LoanInfo;
