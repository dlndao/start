import React, { Fragment, useState, useEffect, useRef } from "react";
import { Row, Col } from "react-bootstrap";

import { useOutsideAlerter } from "utils/useOutsideAlerter";
import strings from "localization";

import SingleProposal from "components/ManageProposal/singleProposal";
import FiltrationBar from "components/ManageProposal/filtrationBar";
import Loader from "components/Layout/loader";
import LoanInfo from "components/LoanStats/loanInfo";

function Borrow({ borrowProposals, handleCallSpinner, loanData }) {
  const [addClicked, setAddClicked] = useState(false);
  const proposals = borrowProposals;
  const [filteredProposals, setFilteredProposals] = useState(borrowProposals);
  const [loadProposals, setLoadProposals] = useState(false);
  const [clickedFilter, setClickedFilter] = useState();

  const handleAddProposal = () => {
    setAddClicked(true);
  };

  const href = window.location.href;
  useEffect(() => {
    (async () => {
      const language: any = localStorage.getItem("language");
      if (language) {
        strings.setLanguage(language);
      }
      //  getProposals();
    })();
  }, [href]);

  useEffect(() => {
    if (clickedFilter) {
      handleFilter(clickedFilter);
    }
  }, []);

  //handle filtering proposal according to status
  const handleFilter = (filter) => {
    let data;

    setLoadProposals(true);
    if (filter !== 0) {
      data = proposals.filter((prop: any) => prop.status === filter);
    } else {
      data = proposals;
    }
    setClickedFilter(filter);
    setTimeout(function() {
      setFilteredProposals(data);
      setLoadProposals(false);
    });
  };

  const wrapperRef = useRef(null);
  //remove demo mode popover when click outside container
  useOutsideAlerter(wrapperRef);

  return (
    <Fragment>
      {loadProposals ? (
        <Row className='mt-5 min-height-100 justify-content-center'>
          <Col>
            <Loader />
          </Col>
        </Row>
      ) : (
        <div ref={wrapperRef} className='min-height-100'>
          <LoanInfo loanData={loanData} />
          <FiltrationBar
            parentClickedFilter={clickedFilter}
            isAddShow={true}
            isDraftShow={true}
            handleAddButton={handleAddProposal}
            handleFilter={handleFilter}
            isShowRepaid={false}
          />
          {addClicked && (
            <Row>
              <Col>
                <SingleProposal
                  data=''
                  isAdd={true}
                  callSpinner={handleCallSpinner}
                  CallAddProposalCanceled={() => setAddClicked(false)}
                  isBorrow={true}
                />
              </Col>
            </Row>
          )}
          {filteredProposals &&
            filteredProposals.map((p: any, index) => (
              <Row key={index}>
                <Col>
                  <SingleProposal
                    data={p}
                    callSpinner={handleCallSpinner}
                    CallAddProposalCanceled={() => setAddClicked(false)}
                    isBorrow={true}
                  />
                </Col>
              </Row>
            ))}
          {filteredProposals && filteredProposals.length <= 0 && (
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

export default Borrow;
