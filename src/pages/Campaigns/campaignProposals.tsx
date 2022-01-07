import React, { Fragment, useState, useEffect, useRef } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { useLocation, Link } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { TwitterIcon, TwitterShareButton } from "react-share";

import { useOutsideAlerter } from "utils/useOutsideAlerter";
import strings from "localization";
import { getMFIData } from "API/api";

import SingleProposal from "components/ManageProposal/singleProposal";
import FiltrationBar from "components/ManageProposal/filtrationBar";
import Menu from "components/Layout/menu";
import Footer from "components/Layout/footer";
import InviteUsers from "components/InviteInvestors";

import loader from "Assets/Images/loader.gif";
import { inviteIcon } from "Assets/Images";

function CampaignProposals() {
  const href = window.location.href;

  const search = useLocation().search;
  const id = new URLSearchParams(search).get("id");
  const mfi = new URLSearchParams(search).get("mfi");

  const [proposals, setProposals] = useState([]);
  const [filteredProposals, setFilteredProposals] = useState([]);
  const [loadProposals, setLoadProposals] = useState(true);
  const [clickedFilter, setClickedFilter] = useState();
  const [userData, setUserData]: any = useState();
  const [callSpinnerFlag, setCallSpinnerFlag] = useState(false);
  const [mfiId, setMFIId] = useState();
  const [campaignData, setCampaignData]: any = useState({});
  const [isSameMfi, setIsSameMFI] = useState(false);
  const [donationUrl, setDonationUrl] = useState("");
  const [isShowTweet, setIsShowTweet] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [loadMenu, setLoadMenu] = useState(false);

  // fetch mfi data
  const handleMfi = async (mfiName) => {
    const response: any = await getMFIData(mfiName);
    if (response) {
      setMFIId(response.id);
      getProposals(response.id);
    }
  };

  //fetch campaign's proposals
  const getProposals = async (mfiId) => {
    let _user: any = {};
    let data = localStorage.getItem("userData");

    if (data) {
      setUserData(JSON.parse(data));
      _user = JSON.parse(data);
    }

    await API.get("auth", `/api/campaign/?campaignId=${id}`, {
      headers: { "Content-Type": "application/json" },
    }).then(async (response) => {
      if (response.success) {
        if (response.data.length != 0) {
          setCampaignData(response.data[0]);
          const donationUrl = mfiId == 1 ? "https://dcbs.in/donation/" : "";
          setDonationUrl(donationUrl);
          if (response.data[0].mfiId === mfiId) {
            setIsSameMFI(true);
            let campProposals: any = [];
            //get proposalCampaigns
            response.data.forEach((element: any) => {
              campProposals = [
                ...campProposals,
                ...element["proposalCampaigns"],
              ];
            });
            let proposalsArr: any = [];
            //get proposals
            for (let ele of campProposals) {
              let obj = ele["borrow"];
              obj["imageUrl"] = await Storage.get(obj["image"]);
              proposalsArr.push(obj);
            }
            setProposals(proposalsArr);
            setFilteredProposals(proposalsArr);
          } else {
            setIsSameMFI(false);
            setFilteredProposals([]);
            setProposals([]);
          }
        }
      }
      setLoadProposals(false);
    });
  };

  useEffect(() => {
    (async () => {
      await handleMfi(mfi);
      const language: any = localStorage.getItem("language");
      if (language) {
        strings.setLanguage(language);
      }
      setLoadMenu(true);
    })();
  }, [href]);

  useEffect(() => {
    if (clickedFilter) {
      handleFilter(clickedFilter);
    }
  }, [callSpinnerFlag]);

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

  //refetch data after updating proposal
  const handleCallSpinner = async () => {
    setLoadProposals(true);
    await getProposals(mfiId);
    setCallSpinnerFlag(!callSpinnerFlag);
  };

  //share tweet
  const handleTweetCampaign = () => {
    setIsShowTweet(!isShowTweet);
  };

  return (
    <Fragment>
      {loadProposals ? (
        <Row className='align-items-center h-100-vh'>
          <Col>
            <img src={loader} className='loader-img' width='200' />
          </Col>
        </Row>
      ) : (
        <>
          {loadMenu && (
            <Menu
              isStart={true}
              isFullData={userData && userData.id !== "" ? true : false}
            />
          )}
          <Row className='justify-content-center app-nav-containers mt-5'>
            <Col xl={7} lg={7} md={7} sm={12}>
              {isSameMfi && (
                <>
                  <Row>
                    <Col>
                      <h4 className='text-capitalize'>
                        {campaignData.name} {strings.campaign}
                      </h4>
                    </Col>
                  </Row>
                  <Row className='m-3'>
                    <Col className='text-left'>
                      <Form.Group>
                        <label className='w-100 h-auto'>
                          <Form.Control
                            type='text'
                            as='textarea'
                            placeholder='Campaign Description'
                            name='desc'
                            value={campaignData.description}
                            disabled={true}
                          />
                        </label>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className='mb-2'>
                      <div className={"d-inline"}>
                        <TwitterShareButton
                          beforeOnClick={() => {
                            handleTweetCampaign();
                          }}
                          url={`${window.location.href}`}
                          title={`I am supporting [${campaignData.name}] campaign on @DLN , check it out at: `}
                          openShareDialogOnClick={!isShowTweet}
                        >
                          <TwitterIcon size={32} round />
                        </TwitterShareButton>
                      </div>
                      <div className={"d-inline m-3"}>
                        {" "}
                        <img
                          className='w-70 h-auto cursor-pointer'
                          src={inviteIcon}
                          alt='icon'
                          onClick={(e) => setShowInviteModal(true)}
                          //ref={inviteAction}
                        />
                      </div>
                      {showInviteModal && (
                        <InviteUsers
                          data={campaignData}
                          InviteModalClosed={() => {
                            setShowInviteModal(false);
                          }}
                          isBorrow={false}
                          isCampaign={true}
                        />
                      )}
                    </Col>
                  </Row>
                  <Row>
                    {campaignData.campaignUrl != "" && (
                      <Col>
                        {strings.campaignUrl}:
                        <a
                          href={campaignData.campaignUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          {" "}
                          {campaignData.campaignUrl}
                        </a>
                      </Col>
                    )}
                  </Row>
                  <Row>
                    <Col>
                      {strings.donationUrl}:
                      <a
                        href={donationUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        {" "}
                        {donationUrl}
                      </a>
                    </Col>
                  </Row>
                </>
              )}
              <Row>
                <Col>
                  <Row>
                    <Col>
                      {userData ? (
                        userData.userMfis.length > 0 ? (
                          <Link
                            className='app-back-link app-link'
                            to={`/App/Campaigns?mfi=${userData?.userMfis[0]?.mfiName}`}
                          >
                            {strings.viewAllCampaign}
                          </Link>
                        ) : (
                          <Link
                            className='app-back-link app-link'
                            to={`/App/Home?mfi=${mfi}`}
                          >
                            {strings.home}
                          </Link>
                        )
                      ) : (
                        <Link
                          to='/App/start'
                          className='app-link app-back-link'
                        >
                          {strings.getStart}
                        </Link>
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>
              <div ref={wrapperRef}>
                <FiltrationBar
                  parentClickedFilter={clickedFilter}
                  isAddShow={false}
                  isDraftShow={true}
                  handleAddButton=''
                  handleFilter={handleFilter}
                />

                {filteredProposals && filteredProposals.length > 0 ? (
                  filteredProposals.map((p: any, index) => (
                    <Row key={index}>
                      <Col>
                        <SingleProposal
                          isMfi={
                            userData && userData.userMfis.length > 0
                              ? true
                              : false
                          }
                          data={p}
                          callSpinner={handleCallSpinner}
                          CallAddProposalCanceled=''
                          isShowOnly={true}
                          isApprove={
                            userData && userData.userMfis.length > 0
                              ? true
                              : false
                          }
                          isShowAction={
                            userData && userData.id !== "" ? true : false
                          }
                          isCampaign={true}
                          campaignName={campaignData.name}
                          campaignId={campaignData.id}
                        />
                      </Col>
                    </Row>
                  ))
                ) : (
                  <Row className='mt-5'>
                    <Col>
                      <h4>{strings.noDataToShow}</h4>
                    </Col>
                  </Row>
                )}
              </div>
            </Col>
          </Row>
          <Row className='justify-content-center'>
            <Col xl={7} lg={7} md={7} sm={12}>
              <Footer />
            </Col>
          </Row>
        </>
      )}
    </Fragment>
  );
}

export default CampaignProposals;
