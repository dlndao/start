import React, { useState, useEffect } from "react";
import { Modal, Spinner, Col, Row } from "react-bootstrap";
import { API } from "aws-amplify";
import { toast } from "react-toastify";

import validator from "validator";
import classNames from "classnames";
import strings from "localization";

import inviteIcon from "Assets/Images/icons/invite.png";
import cancelIcon from "Assets/Images/icons/cancel.png";
import plusIcon from "Assets/Images/icons/plus.png";

function InviteUsers({
  data,
  InviteModalClosed,
  isBorrow = false,
  isCampaign = false,
}) {
  const [showInviteModal, setShowInviteModal]: any = useState(true);
  const [bakersEmails, setBakersEmails]: any = useState([]);
  const [singleBakerEmail, setSingleBakerEmail]: any = useState("");
  const [isAddEmail, setIsAddEmail]: any = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [isArabic, setIsArabic] = useState(false);
  const [userData, setUserData]: any = useState();
  const [loadingSingleInvite, setLoadingSingleInvite]: any = useState(false);
  const [loadingAllInvite, setLoadingAllInvite]: any = useState(false);
  const [mfiName, setMFIName] = useState();

  useEffect(() => {
    const language: any = localStorage.getItem("language");
    let currentData = localStorage.getItem("userData");
    let storage: any = localStorage.getItem("mfiData");
    let mfiData: any = storage ? JSON.parse(storage) : null;

    if (currentData) {
      setUserData(JSON.parse(currentData));
    }

    //setting current language
    if (language) {
      if (language === "ar") {
        setIsArabic(true);
      } else {
        setIsArabic(false);
      }
    } else {
      setIsArabic(false);
    }
    if (mfiData) {
      setMFIName(mfiData.name);
    }
  }, []);

  //invite investors functionality
  const handleInviteBacker = async (isAll) => {
    let singleEmailToArr = [singleBakerEmail];
    let isValid = false;
    if (
      !isAll &&
      singleBakerEmail !== "" &&
      validator.isEmail(singleBakerEmail)
    ) {
      isValid = true;
    } else if (
      !isAll &&
      (singleBakerEmail === "" || !validator.isEmail(singleBakerEmail))
    ) {
      isValid = false;
      setShowErrors(true);
    } else {
      isValid = true;
    }
    if (isValid) {
      isAll ? setLoadingAllInvite(true) : setLoadingSingleInvite(true);
      isCampaign
        ? inviteForCampaignAPI(isAll, singleEmailToArr)
        : inviteForProposalAPI(isAll, singleEmailToArr);
    }
  };

  //handle functionality after sending email successfully
  const handleEmailSent = (isAll) => {
    toast.success("Email Sent Successfully");
    setLoadingSingleInvite(false);
    setLoadingAllInvite(false);
    if (isAll) {
      handleCloseModal();
    }
  };

  //send email to invite investors to bake proposal
  const inviteForProposalAPI = async (isAll, singleEmailToArr) => {
    await API.post("auth", "/api/borrow/sendBackInvitations", {
      headers: { "Content-Type": "application/json" },
      body: {
        sendToMails: isAll ? bakersEmails : singleEmailToArr,
        title: data.title,
        description: data.description,
        amount: data.amount,
        address: isBorrow ? userData.id : data.userId,
        proposalId: data.id,
        userId: userData.id,
        proposalOwner: isBorrow
          ? userData.firstName + " " + userData.lastName
          : data.user.firstName + " " + data.user.lastName,
      },
    }).then((response) => {
      handleEmailSent(isAll);
    });
  };

  //send email to invite investors to bake campaign
  const inviteForCampaignAPI = async (isAll, singleEmailToArr) => {
    await API.post("auth", "/api/borrow/sendCampaignInvite", {
      headers: { "Content-Type": "application/json" },
      body: {
        sendToMails: isAll ? bakersEmails : singleEmailToArr,
        campaignName: data.name,
        campaignUrl: mfiName
          ? `https://start.dlndao.org/#/App/proposalsByCampaign?mfi=${mfiName}&id=${data.id}`
          : `https://start.dlndao.org/#/App/proposalsByCampaign?mfi=ROI&id=${data.id}`,
        campaignDesc: data.description,
      },
    }).then((response) => {
      handleEmailSent(isAll);
    });
  };

  //handle adding email in input
  const handleChange = (e: any) => {
    const { value } = e.target;
    setSingleBakerEmail(value);
  };

  //add new baker email to backers array
  const AddEmail = () => {
    setShowErrors(true);
    if (singleBakerEmail !== "" && validator.isEmail(singleBakerEmail)) {
      setIsAddEmail(true);
      setTimeout(function() {
        setBakersEmails([...bakersEmails, singleBakerEmail]);
      });
      setSingleBakerEmail("");
      setShowErrors(false);
    }
  };

  //remove backer email from backers array on delete
  const handleCancel = (e, index) => {
    var array = [...bakersEmails]; // make a separate copy of the array
    if (index !== -1) {
      array.splice(index, 1);
      setBakersEmails(array);
    }
  };

  //close invite investors modal, call parent functionality on close
  const handleCloseModal = () => {
    setShowInviteModal(false);
    InviteModalClosed();
  };

  return (
    <Modal
      show={showInviteModal}
      onHide={() => {
        handleCloseModal();
      }}
      size='lg'
      backdrop='static'
      className={classNames(
        "dln-centered-vertically-modal",
        isArabic && "app-arabic-lang"
      )}
    >
      <Modal.Header closeButton>
        <Modal.Title className='app-text-blue'>
          {strings.letsInviteBackers} {isCampaign ? data.name : data.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='row form-group  my-3 my-3 mx-lg-5 mx-md-3 mx-sm-0  justify-content-center'>
          <div className='col-2 text-left d-flex align-self-center'>Email</div>
          <div className='col-6'>
            <input
              type='email'
              className='form-control'
              name='backerEmail'
              value={singleBakerEmail}
              onChange={handleChange}
            />
            {showErrors === true && validator.isEmpty(singleBakerEmail) && (
              <div className='app-error-msg'>Required</div>
            )}
            {showErrors === true &&
              !validator.isEmpty(singleBakerEmail) &&
              !validator.isEmail(singleBakerEmail) && (
                <div className='app-error-msg'>Wrong email format</div>
              )}
          </div>

          <div className='col-4'>
            <Row>
              <Col className='col-4  mr-1'>
                {loadingSingleInvite ? (
                  <Spinner
                    className='mr-1 dln-button-loader'
                    as='span'
                    animation='border'
                    role='status'
                    aria-hidden='true'
                  />
                ) : (
                  <img
                    className='app-plus-icon'
                    src={inviteIcon}
                    alt='icon'
                    onClick={(e) => handleInviteBacker(false)}
                  />
                )}
              </Col>
              <div className='col-4'>
                <img
                  className='app-plus-icon'
                  src={plusIcon}
                  alt='icon'
                  onClick={AddEmail}
                />
              </div>
            </Row>
          </div>
        </div>
        {bakersEmails.length > 0 && (
          <div className='row form-group  my-3 mx-lg-5 mx-md-3 mx-sm-0 '>
            <div className='col'>
              {isAddEmail &&
                bakersEmails &&
                bakersEmails?.map((b: any, index) => (
                  <div className='mb-1 app-inviters-emails' key={index}>
                    <div className='float-left'>{b}</div>
                    <div className='text-right'>
                      <img
                        className='app-cancel-icon'
                        src={cancelIcon}
                        alt='icon'
                        onClick={(e) => handleCancel(e, index)}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
        {bakersEmails.length > 0 && (
          <div className='row form-group  my-3 mx-5 justify-content-end'>
            <div className='col'>
              <button
                type='button'
                onClick={(e) => handleInviteBacker(true)}
                className='app-primary-btn'
              >
                {loadingAllInvite ? (
                  <Spinner
                    className='mr-1 dln-button-loader'
                    as='span'
                    animation='border'
                    role='status'
                    aria-hidden='true'
                  />
                ) : (
                  strings.inviteAll
                )}
              </button>
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}
export default InviteUsers;
