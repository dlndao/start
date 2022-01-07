import React, { Fragment, useState, useEffect } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import classNames from "classnames";
import { API } from "aws-amplify";
import { toast } from "react-toastify";

import strings from "localization";

import loader from "Assets/Images/loader.gif";

function AssignProposalToCampaign({
  data,
  assignModalClosed,
  mfiId,
  userId,
  callSpinner,
}) {
  const [showAssignModal, setShowAssignModal]: any = useState(true);
  const [loading, setLoading] = useState(false);
  const [isArabic, setIsArabic] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("0");

  //close modal, call parent functionality on close
  const handleCloseModal = () => {
    setShowAssignModal(false);
    assignModalClosed();
  };

  const fetchAllCampaigns = async (mfiId) => {
    setLoading(true);
    await API.get("auth", `/api/campaign/?mfiId=${mfiId}`, {
      headers: { "Content-Type": "application/json" },
    }).then(async (response) => {
      if (response.success == true) {
        setCampaigns(response.data);
      } else {
        toast.error("error on loading data..");
      }
      setLoading(false);
    });
  };

  //assign proposal to campaign
  const assignToCampaign = async () => {
    if (selectedCampaign != "0") {
      if (data.isMFIApproved == false) {
        ApproveTheProposal(data.id, mfiId);
      }
      setLoading(true);
      await API.post("auth", "/api/campaign/addProposalTo", {
        headers: { "Content-Type": "application/json" },
        body: {
          proposalId: data.id,
          userId: userId,
          campaignIds: [parseInt(selectedCampaign)],
        },
      }).then(async (response) => {
        setShowAssignModal(false);
        toast.success("Proposal Assigned Successfully");
        setLoading(false);
        callSpinner();
      });
    }
  };

  const ApproveTheProposal = async (proposalId, mfiId) => {
    await API.post("auth", `/api/mfi/approveProposal`, {
      headers: { "Content-Type": "application/json" },
      queryStringParameters: { mfiId: mfiId, proposalId: proposalId },
    }).then((response) => {
      if (response.error?.toLowerCase() != "already approved") {
        toast.success(strings.proposalApprovedSucc);
      }
    });
  };

  const onChangeValue = (event) => {
    setSelectedCampaign(event.target.value);
  };

  useEffect(() => {
    (async () => {
      //setting current language
      const language: any = localStorage.getItem("language");
      if (language) {
        if (language === "ar") {
          setIsArabic(true);
        } else {
          setIsArabic(false);
        }
      } else {
        setIsArabic(false);
      }
    })();
    fetchAllCampaigns(mfiId);
  }, []);

  return (
    <Modal
      show={showAssignModal}
      onHide={() => {
        handleCloseModal();
      }}
      size='lg'
      backdrop='static'
      className={classNames(
        "dln-centered-vertically-modal",
        isArabic && "app-arabic-lang"
      )}
      scrollable={true}
    >
      <Modal.Header closeButton>
        <Modal.Title className='app-text-blue'>
          {strings.assignProposalToCampaign}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <Row className='align-items-center'>
            <Col className='text-center'>
              <img src={loader} className='loader-img' width='200' />
            </Col>
          </Row>
        ) : (
          <Fragment>
            <div>
              {campaigns &&
                campaigns.map((p: any, index) => (
                  <Row className='my-3 mx-5' key={index}>
                    <Col
                      lg
                      xl='6'
                      sm
                      xs
                      md='12'
                      className='app-campaigns-list-holder'
                    >
                      <Row>
                        <Col className='col-2 text-center align-self-center'>
                          <div onChange={onChangeValue}>
                            <input type='radio' value={p.id} name={"t"} />
                          </div>
                        </Col>
                        <Col className='app-proposal-right-side justify-content-center'>
                          <h5 className='mt-1'>{p.name}</h5>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                ))}
            </div>

            <div className='row form-group my-3 mx-5'>
              <div className='col d-flex justify-content-end'>
                <button
                  type='button'
                  onClick={(e) => assignToCampaign()}
                  className='app-primary-btn'
                >
                  {strings.assign}
                </button>
              </div>
            </div>
          </Fragment>
        )}
      </Modal.Body>
    </Modal>
  );
}
export default AssignProposalToCampaign;
