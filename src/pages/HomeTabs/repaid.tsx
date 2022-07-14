import React, { Fragment, useState, useEffect, useRef } from "react";
import { Row, Col } from "react-bootstrap";

import { useOutsideAlerter } from "utils/useOutsideAlerter";
import strings from "localization";

import SingleProposal from "components/ManageProposal/singleProposal";
import LoanInfo from "components/LoanStats/loanInfo";
import Loader from "components/Layout/loader";
/**
 * 
 * @returns UI element
 */
function Repaid({ repaidProposals, handleCallSpinner, loanData }:{
  repaidProposals:[any], handleCallSpinner:Function, loanData:any
}) {
  const [proposals, setProposals]: any = useState(repaidProposals);
  const [loadProposals, setLoadProposals] = useState(false);

  useEffect(() => {
    (async () => {
      const language: any = localStorage.getItem("language");
      if (language) {
        strings.setLanguage(language);
      }
    })();
  }, []);

  const wrapperRef = useRef(null);
  //remove demo mode popover when click outside container
  useOutsideAlerter(wrapperRef);

  return (
    <Fragment>
      {loadProposals ? (
        <Row className='mt-5 min-height-100'>
          <Col>
            <Loader />
          </Col>
        </Row>
      ) : (
        <div ref={wrapperRef} className='min-height-100'>
          <LoanInfo loanData={loanData} />

          {proposals &&
            proposals.map((p: any, index) => (
              <Row key={index}>
                <Col>
                  <SingleProposal
                    data={p}
                    callSpinner={handleCallSpinner}
                    CallAddProposalCanceled=''
                    isBorrow={true}
                  />
                </Col>
              </Row>
            ))}
          {proposals && proposals.length <= 0 && (
            <Row className='mt-5'>
              <Col>
                <h4>{strings.noDataToShow}</h4>
              </Col>
            </Row>
          )}
        </div>
      )}
    </Fragment>
  );
}
export default Repaid;
