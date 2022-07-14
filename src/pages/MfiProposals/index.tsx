import React, { Fragment, useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { API } from "aws-amplify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

import { ProposalStatus } from "Enums/ProposalStatus";
import strings from "localization";

import FiltrationBar from "components/ManageProposal/filtrationBar";
import SingleProposal from "components/ManageProposal/singleProposal";
import Footer from "components/Layout/footer";
import Loader from "components/Layout/loader";
/**
 * fetch and display the MFI's proposals
 * @returns UI element
 */
function MfiProposals() {
  const href = window.location.href;

  const [proposals, setProposals] = useState([]);
  const [loadProposals, setLoadProposals] = useState(false);
  const [UsermfiId, setMFIID] = useState();
  const [filteredProposals, setFilteredProposals] = useState([]);
  const [clickedFilter, setClickedFilter] = useState();
  const [isHasAccess, setIsHasAccess] = useState(false);
  const [mfiStats, setMfiStats]: any = useState();
  const [callSpinnerFlag, setCallSpinnerFlag] = useState(false);

  useEffect(() => {
    (async () => {
      let data = localStorage.getItem("userData");
      let currentUser: any;
      if (data) {
        currentUser = JSON.parse(data);
      }
      if (currentUser.userMfis.length > 0) {
        setIsHasAccess(true);
        if (currentUser.userMfis[0].mfiId) {
          setMFIID(currentUser.userMfis[0].mfiId);
        }
        setLoadProposals(true);

        await getProposals();
        await getMfiStats();
        setLoadProposals(false);
      } else {
        setIsHasAccess(false);
      }
    })();
  }, [href]);

  useEffect(() => {
    if (clickedFilter) {
      handleFilter(clickedFilter);
    }
  }, [callSpinnerFlag]);

  const getProposals = async () => {
    let data = localStorage.getItem("userData");
    let currentUser: any;
    let mfiId: any;
    if (data) {
      currentUser = JSON.parse(data);

      if (currentUser.userMfis.length > 0) {
        setIsHasAccess(true);
        if (currentUser.userMfis[0].mfiId) {
          mfiId = currentUser.userMfis[0].mfiId;
        }
      }
    }
    setLoadProposals(true);
    const proposals = await API.get("auth", "/api/borrow/proposalsByMFIID", {
      headers: { "Content-Type": "application/json" },
      queryStringParameters: {
        mfiId: mfiId,
        address: currentUser.id,
        userId: currentUser.id,
      },
    });
    setProposals(
      proposals.data.filter(
        (prop: any) => prop.status !== ProposalStatus.drafted
      )
    );
    setFilteredProposals(
      proposals.data.filter(
        (prop: any) => prop.status !== ProposalStatus.drafted
      )
    );
  };

  //handle filtering proposal according to status
  const handleFilter = (filter) => {
    let data;
    setLoadProposals(true);
    if (filter === "active") {
      data = proposals.filter(
        (prop: any) =>
          prop.status !== ProposalStatus.drafted &&
          prop.status !== ProposalStatus.published
      );
    } else if (filter !== 0 && filter !== "active") {
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

  //fetch mfi's Statistics
  const getMfiStats = async () => {
    let data = localStorage.getItem("userData");
    let currentUser: any;
    let mfiName: any;
    if (data) {
      currentUser = JSON.parse(data);

      if (currentUser.userMfis.length > 0) {
        if (currentUser.userMfis[0].mfiName) {
          mfiName = currentUser.userMfis[0].mfiName;
        }
      }
    }
    const stats = await API.get("auth", "/api/mfi/stats", {
      headers: { "Content-Type": "application/json" },
      queryStringParameters: { name: mfiName, userId: currentUser.id },
    });
    setMfiStats(stats.data);
    setLoadProposals(false);
  };

  //refetch data after updating proposal
  const handleCallSpinner = async () => {
    setLoadProposals(true);
    await getProposals();
    await getMfiStats();
    setCallSpinnerFlag(!callSpinnerFlag);
    setLoadProposals(false);
  };

  return (
    <Fragment>
      {!isHasAccess ? (
        <Row className='justify-content-center mt-5'>
          <Col xl={7} lg={7} md={7} sm={12}>
            <Row className='mb-2'>
              <Col>You Don't have Access to this page</Col>
            </Row>
            <Row>
              <Col>
                {" "}
                <Link className='app-back-link app-link' to='/App/Home'>
                  <FontAwesomeIcon icon={faLongArrowAltLeft} />{" "}
                  <span>{strings.backToHome}</span>
                </Link>
              </Col>
            </Row>
          </Col>
        </Row>
      ) : (
        <Fragment>
          {loadProposals ? (
            <Row className='justify-content-center mt-5 min-height-100'>
              <Col xl={7} lg={7} md={7} sm={12}>
                <Loader />
              </Col>
            </Row>
          ) : (
            <Fragment>
              <Row className='justify-content-center'>
                <Col xl={7} lg={7} md={7} sm={12}>
                  <Row>
                    <Col>
                      <Link className='app-back-link app-link' to='/App/Home'>
                        <span>{strings.home}</span>
                      </Link>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Link
                        className='app-back-link app-link'
                        to='/App/Campaigns'
                      >
                        <span>{strings.manageCampaigns}</span>
                      </Link>
                    </Col>
                  </Row>
                  <Row className='justify-content-center app-inner-page app-inner-page-tab pb-3'>
                    <Col
                      xl={4}
                      lg={4}
                      md={4}
                      sm={6}
                      className='pb-3 d-flex pl-lg-0 pl-md-0 ol-sm-5  app-justify-content-center'
                    >
                      <div className='align-self-center mt-3'>
                        <h6>{strings.proposalInProgress}</h6>
                        <div
                          className='app-gray-box p-3'
                          onClick={(e) =>
                            handleFilter(ProposalStatus.published)
                          }
                        >
                          <div>{mfiStats?.inProgress.count}</div>
                          <div>{strings.proposals}</div>
                        </div>
                        <div
                          className='app-gray-box p-3 mt-2'
                          onClick={(e) =>
                            handleFilter(ProposalStatus.published)
                          }
                        >
                          <div>Balance: {mfiStats?.inProgress.balance}$</div>
                          <div>
                            {strings.amount}: {mfiStats?.inProgress.amount}$
                          </div>
                          <div>{strings.totalProposalsValue}</div>
                        </div>
                      </div>
                    </Col>
                    <Col
                      xl={4}
                      lg={4}
                      md={4}
                      sm={6}
                      className='pb-3 d-flex  justify-content-center'
                    >
                      <div className='align-self-center mt-3'>
                        <h6>{strings.activeProposals}</h6>
                        <div
                          className='app-blue-box p-3 '
                          onClick={(e) => handleFilter("active")}
                        >
                          <div>{mfiStats?.active.count}</div>
                          <div>{strings.loans}</div>
                        </div>
                        <div
                          className='app-blue-box p-3 mt-2'
                          onClick={(e) => handleFilter("active")}
                        >
                          <div>Balance: {mfiStats?.active.balance}$</div>
                          <div>
                            {strings.amount}: {mfiStats?.active.amount}$
                          </div>
                          <div>{strings.totalValue}</div>
                        </div>
                      </div>
                    </Col>
                    <Col
                      xl={4}
                      lg={4}
                      md={4}
                      sm={6}
                      className='pb-3 pr-lg-0 pr-md-0 pr-sm-5 d-flex justify-content-end  app-justify-content-center'
                    >
                      <div className='align-self-center mt-3'>
                        <h6>{strings.repaidProposals}</h6>
                        <div
                          className='app-green-box p-3'
                          onClick={(e) => handleFilter(ProposalStatus.repaid)}
                        >
                          <div>{mfiStats?.repaid.count}</div>
                          <div>{strings.loans}</div>
                        </div>
                        <div
                          className='app-green-box p-3 mt-2'
                          onClick={(e) => handleFilter(ProposalStatus.repaid)}
                        >
                          <div>Balance: {mfiStats?.repaid.balance}$</div>
                          <div>
                            {strings.amount}: {mfiStats?.repaid.amount}$
                          </div>
                          <div>{strings.totalRepaidSmall}</div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <FiltrationBar
                    parentClickedFilter={clickedFilter}
                    isAddShow={false}
                    isDraftShow={false}
                    handleAddButton=''
                    handleFilter={handleFilter}
                  />

                  {filteredProposals &&
                    filteredProposals.map((p: any, index) => (
                      <Row key={index}>
                        <Col>
                          <SingleProposal
                            isMfi={true}
                            data={p}
                            callSpinner={() => {
                              handleCallSpinner();
                            }}
                            CallAddProposalCanceled=''
                            isShowOnly={true}
                            isApprove={true}
                          />
                        </Col>
                      </Row>
                    ))}
                  {filteredProposals && filteredProposals.length <= 0 && (
                    <Row className='mt-5'>
                      <Col>
                        <h4>No Data To Show</h4>
                      </Col>
                    </Row>
                  )}
                </Col>
              </Row>
              <Row className='justify-content-center'>
                <Col xl={7} lg={7} md={7} sm={12}>
                  <Footer />
                </Col>
              </Row>
            </Fragment>
          )}
        </Fragment>
      )}
    </Fragment>
  );
}

export default MfiProposals;
