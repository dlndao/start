import React, { Fragment, useEffect, useState } from "react";
import { Tooltip as MaterialToolTip } from "@material-ui/core";
import { Row, Col } from "react-bootstrap";
import { API } from "aws-amplify";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltLeft } from "@fortawesome/free-solid-svg-icons";

import CampaignCard from "components/ManageCampaigns/campaignCard";
import Loader from "components/Layout/loader";
import strings from "localization";

import plusIcon from "Assets/Images/icons/plus.png";
/**
 * fetch and  display Campaigns 
 * @returns UI element
 */
function Campaigns() {
  const [loadCampaign, setLoadCampaign] = useState(false);
  const [isHasAccess, setIsHasAccess] = useState(false);
  const href = window.location.href;

  useEffect(() => {
    (async () => {
      let storage: any = localStorage.getItem("userData");
      let _userData: any = storage ? JSON.parse(storage) : null;
      if (_userData) {
        setUserData(_userData);
        if (_userData.userMfis.length > 0) {
          setIsHasAccess(true);
          fetchAllCampaigns(_userData.userMfis[0].mfiId);
        } else {
          setIsHasAccess(false);
        }
      }
    })();
  }, [href]);

  const [isAdd, setIsAdd] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [userData, setUserData]: any = useState();
  const setLoading = () => {
    fetchAllCampaigns(userData.userMfis[0].mfiId);
    setLoadCampaign(!loadCampaign);
  };

  const fetchAllCampaigns = async (mfiId) => {
    setLoadCampaign(true);
    await API.get("auth", `/api/campaign/?mfiId=${mfiId}`, {
      headers: { "Content-Type": "application/json" },
    }).then(async (response) => {
      if (response.success == true) {
        setCampaigns(response.data);
      } else {
        toast.error("error on loading data..");
      }

      setLoadCampaign(false);
    });
  };

  const setAddValue = () => {
    setIsAdd(false);
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
          {loadCampaign ? (
            <Row className='justify-content-center mt-5 min-height-100'>
              <Col xl={7} lg={7} md={7} sm={12}>
                <Loader />
              </Col>
            </Row>
          ) : (
            <div>
              <h3>{strings.manageCampaigns}</h3>
              <div className='p-3'>
                <MaterialToolTip
                  PopperProps={{ disablePortal: true }}
                  classes={{
                    tooltip: "dln-tooltip",
                    arrow: "dln-tooltip-arrow",
                  }}
                  arrow
                  placement='top'
                  title={strings.addCampaign}
                >
                  <img
                    className='app-action-icon'
                    src={plusIcon}
                    alt='icon'
                    onClick={(e) => setIsAdd(true)}
                  />
                </MaterialToolTip>
              </div>
              <Row>
                <Col>
                  <Link
                    className='app-back-link app-link'
                    to={`/App/MFIProposals?mfi=${userData?.userMfis[0]?.mfiName}`}
                  >
                    <span>{strings.back}</span>
                  </Link>
                </Col>
              </Row>
              {isAdd && (
                <Row>
                  <Col>
                    <CampaignCard
                      reloadCampaignsValue={() =>
                        fetchAllCampaigns(userData.userMfis[0].mfiId)
                      }
                      callLoading={() => setLoading()}
                      data=''
                      isAdd={true}
                      CallAddProposalCanceled={() => setAddValue()}
                    />
                  </Col>
                </Row>
              )}
              {campaigns &&
                campaigns.map((p: any, index) => (
                  <Row key={index}>
                    <Col>
                      <CampaignCard
                        reloadCampaignsValue={() =>
                          fetchAllCampaigns(userData.userMfis[0].mfiId)
                        }
                        callLoading={() => setLoading()}
                        data={p}
                        isAdd={isAdd}
                        CallAddProposalCanceled={() => setAddValue()}
                      />
                    </Col>
                  </Row>
                ))}
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
}
export default Campaigns;
