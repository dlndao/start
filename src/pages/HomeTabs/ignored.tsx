import React, { Fragment, useState, useEffect, useRef } from "react";
import { API } from "aws-amplify";
import { Row, Col } from "react-bootstrap";

import { useOutsideAlerter } from "utils/useOutsideAlerter";
import strings from "localization";

import SingleProposal from "components/ManageProposal/singleProposal";
import FiltrationBar from "components/ManageProposal/filtrationBar";

import Loader from "components/Layout/loader";
import LoanInfo from "components/LoanStats/loanInfo";

function Ignored({ loanData }) {
  const [addClicked, setAddClicked] = useState(false);
  const [proposals, setProposals] = useState([]);
  const [filteredProposals, setFilteredProposals] = useState([]);
  const [loadProposals, setLoadProposals] = useState(false);
  const [clickedFilter, setClickedFilter] = useState();
  const [userData, setUserData]: any = useState();
  const [callSpinnerFlag, setCallSpinnerFlag] = useState(false);

  const handleAddProposal = () => {
    setAddClicked(true);
  };

  useEffect(() => {
    (async () => {
      const language: any = localStorage.getItem("language");
      if (language) {
        strings.setLanguage(language);
      }
      getProposals();
    })();
  }, []);

  const getProposals = async () => {
    let _user: any = {};
    setLoadProposals(true);
    let data = localStorage.getItem("userData");
    if (data) {
      setUserData(JSON.parse(data));
      _user = JSON.parse(data);
    }
    const proposals = await API.get(
      "auth",
      "/api/borrow/userIgnoredProposals",
      {
        headers: { "Content-Type": "application/json" },
        queryStringParameters: { userId: _user.id },
      }
    );

    setProposals(proposals.data);
    setFilteredProposals(proposals.data);
    setLoadProposals(false);
  };

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

  useEffect(() => {
    if (clickedFilter) {
      handleFilter(clickedFilter);
    }
  }, [clickedFilter, handleFilter]);

  const wrapperRef = useRef(null);
  //remove demo mode popover when click outside container
  useOutsideAlerter(wrapperRef);

  //refetch data after updating proposal
  const handleCallSpinner = async () => {
    await getProposals();
    setCallSpinnerFlag(!callSpinnerFlag);
  };

  return (
    <Fragment>
      {loadProposals ? (
        <Row className='mt-5 min-height-100'>
          <Col>
            <Loader />
          </Col>
        </Row>
      ) : (
        <div ref={wrapperRef}>
          <LoanInfo loanData={loanData} />
          <FiltrationBar
            parentClickedFilter={clickedFilter}
            isAddShow={false}
            isDraftShow={true}
            handleAddButton={handleAddProposal}
            handleFilter={handleFilter}
            isShowRepaid={false}
          />
          {filteredProposals &&
            filteredProposals.map((p: any, index) => (
              <Row key={index}>
                <Col>
                  <SingleProposal
                    data={p}
                    callSpinner={handleCallSpinner}
                    CallAddProposalCanceled={() => setAddClicked(false)}
                    isBorrow={true}
                    isIgnored={true}
                    isShowOnly={true}
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
export default Ignored;
