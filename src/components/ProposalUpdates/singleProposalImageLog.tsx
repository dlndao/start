import React, { useState, useEffect, useRef } from "react";
import { Spinner } from "react-bootstrap";
import classNames from "classnames";
import { Row, Col, Form } from "react-bootstrap";
import { Avatar } from "@material-ui/core";
import { Storage, API } from "aws-amplify";
import { v4 as uuid } from "uuid";
import moment from "moment";
import { toast } from "react-toastify";
import { TwitterIcon, TwitterShareButton } from "react-share";
import validator from "validator";

import strings from "localization";

import ConfirmationModal from "../Modals/confirmationModal";

import save from "Assets/Images/icons/save.png";
import deleteIcon from "Assets/Images/icons/delete.png";
import cancelIcon from "Assets/Images/icons/cancel.png";

function SingleProposalImageLog({
  item,
  isAdd,
  CallAddProposalCanceled,
  proposal,
  callSpinner,
  isBorrow = false,
}) {
  const [description, setDescription]: any = useState("");
  const [fileName, setFileName] = useState("");
  const [fileData, setFileData] = useState();
  const [fileType, setFileType] = useState();
  const [uploadImage, setUploadImage] = useState(false);
  const [proposalImg, setProposalImg] = useState(item.image);
  const [saveClicked, setSaveClicked] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [isTwitter, setIsTwitter] = useState(false);
  const [isSendEmail, setIsSendEmail] = useState(false);
  const [mfiName, setMFIName] = useState();
  const [userData, setUserData]: any = useState();

  const fileImgInput: any = useRef<HTMLInputElement>();
  const twitterBtnRef: any = useRef(null); //to trigger click of twitter

  let storage: any = localStorage.getItem("mfiData");
  let mfiData: any = storage ? JSON.parse(storage) : null;

  //fetch backers list
  const getBakers = async () => {
    let backers: any = [];
    await API.get("auth", "/api/borrow/backersList", {
      headers: { "Content-Type": "application/json" },
      queryStringParameters: { proposalId: proposal.id },
    }).then((response) => {
      if (response.success) {
        backers = [...new Set(response.data.map((item) => item.email))]; // [ 'A', 'B']
      }
    });
    return backers;
  };

  useEffect(() => {
    (async () => {
      const language: any = localStorage.getItem("language");
      if (language) {
        strings.setLanguage(language);
      }
      if (!isAdd && item && item !== "") {
        setProposalImg(item.image);
      }
      let currentData = localStorage.getItem("userData");
      if (currentData) {
        setUserData(JSON.parse(currentData));
      }
      if (mfiData) {
        setMFIName(mfiData.name);
      }
    })();
  }, []);

  const handleChange = (e) => {
    setDescription(e.target.value);
  };

  const handleCHKChange = (e, type) => {
    if (type === "twitter") {
      setIsTwitter(e.target.checked);
    } else if (type === "email") {
      setIsSendEmail(e.target.checked);
    }
  };

  //prepare image to save it
  const upload = async (e) => {
    const genericId = uuid();
    setUploadImage(true);
    setProposalImg(URL.createObjectURL(e.target.files[0]));
    let file = fileImgInput.current.files[0];
    let reader = new FileReader();
    reader.readAsArrayBuffer(file);
    setFileType(e.target.files[0].type);
    setFileName(genericId + "_" + proposal.id + "_" + e.target.files[0].name);
    reader.onload = async (event: any) => {
      setFileData(event.target.result);
    };
  };

  //save image to s3 bucket
  const saveImage = async (name, data, type) => {
    let fileKey;
    await Storage.put("proposalImages" + "/" + name, data, {
      contentType: type,
      level: "public",
    }).then((result) => {
      fileKey = result; //result.key;
    });
    return fileKey.key;
  };

  //send notification email to backers about this update
  const handleSendEmail = async () => {
    const backers = await getBakers();
    await API.post("auth", "/api/borrow/sendNewUpdateEmail", {
      headers: { "Content-Type": "application/json" },
      body: {
        sendToMails: backers,
        proposalOwnerName: userData.firstName + " " + userData.lastName,
        proposalName: proposal.title,
        description: proposal.desc,
        proposalURL: mfiName
          ? `https://start.dlndao.org/#/App/proposal?mfi=${mfiName}&id=${proposal.id}`
          : `https://start.dlndao.org/#/App/proposal?mfi=ROI&id=${proposal.id}`,
      },
    }).then((response) => {
      toast.success("Email Sent Successfully");
    });
  };

  //save proposal update to DB
  const handleSave = async (e) => {
    setShowErrors(true);

    e.preventDefault();
    if (description !== "" && uploadImage) {
      setSaveClicked(true);
      let key: any = null;
      if (uploadImage) {
        key = await saveImage(fileName, fileData, fileType);
      }
      await API.post("auth", "/api/borrow/proposalImage", {
        headers: { "Content-Type": "application/json" },
        body: {
          proposalId: proposal.id,
          image: key,
          description: description,
        },
      }).then((response) => {
        if (isTwitter) {
          twitterBtnRef.current.click();
        }
        if (isSendEmail) {
          handleSendEmail();
        }
        toast.success("Proposal Update Saved Successfully");
        if (isAdd) {
          CallAddProposalCanceled();
        }
        callSpinner();
        setUploadImage(false);
        setSaveClicked(false);
      });
    }
  };

  const handleCancel = (e) => {
    CallAddProposalCanceled();
  };

  const handleOpenModalDelete = async () => {
    setShowDeleteModal(true);
  };

  //delete proposal update
  const handleDelete = async (id) => {
    await API.del("auth", `/api/borrow/proposalImage`, {
      headers: { "Content-Type": "application/json" },
      queryStringParameters: { id: item.id },
    }).then((response) => {
      toast.success("Proposal update deleted Successfully");
      callSpinner();
    });
  };

  return (
    <div className='p-3 app-proposal-update mb-3'>
      <Row>
        <Row className='w-100'>
          <Col className='col-3  align-items-center justify-content-center'>
            <label
              className={classNames(
                "app-user-profile-img-container position-relative ml-2"
              )}
            >
              <Avatar
                alt=''
                src={proposalImg}
                className='app-album-image app-proposal-img'
              />

              <input
                accept='*/*'
                className='d-none'
                type='file'
                ref={fileImgInput}
                onChange={(e) => upload(e)}
                disabled={!isAdd}
              />
            </label>
          </Col>
          <Col className='col-9'>
            <Form.Group>
              <Form.Control
                type='text'
                as='textarea'
                className='text-left '
                value={item.description}
                name='desc'
                onChange={handleChange}
                disabled={!isAdd}
              />
              {showErrors === true && validator.isEmpty(description) && (
                <div className='text-left app-error-msg'>
                  {strings.required}
                </div>
              )}
            </Form.Group>
            <Row>
              <Col className=' d-flex'>
                <div>
                  {strings.updated}{" "}
                  {isAdd
                    ? moment(new Date()).format("DD/MM/YYYY")
                    : moment(item.date).format("DD/MM/YYYY")}
                </div>
              </Col>
            </Row>
            {isAdd && (
              <Row>
                <Col className='text-left'>
                  <div className='form-check'>
                    <label className='form-check-label'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        name='chk_twitter'
                        onChange={(e) => handleCHKChange(e, "twitter")}
                        checked={isTwitter}
                      />
                      <div className='pr-3 pt-1'>{strings.shareViaTwitter}</div>
                    </label>
                  </div>
                </Col>

                <Col className='text-left'>
                  <div className='form-check'>
                    <label className='form-check-label'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        name='chk_email'
                        onChange={(e) => handleCHKChange(e, "email")}
                        checked={isSendEmail}
                      />
                      <div className='pr-3 pt-1'>
                        {strings.sendEmailToInvestors}
                      </div>
                    </label>
                  </div>
                </Col>
              </Row>
            )}
          </Col>
        </Row>
        <Col className=''>
          <Row className='justify-content-between'>
            <Col
              className={classNames(
                " align-items-center justify-content-center ",
                !isAdd ? "d-none" : ""
              )}
            >
              {saveClicked ? (
                <Spinner
                  className='mr-1 dln-button-loader'
                  as='span'
                  animation='border'
                  role='status'
                  aria-hidden='true'
                />
              ) : (
                <img
                  className={classNames("app-action-icon")}
                  src={save}
                  alt='icon'
                  onClick={(e) => handleSave(e)}
                />
              )}
              <div className='d-none'>
                <TwitterShareButton
                  ref={twitterBtnRef}
                  url={
                    mfiName
                      ? `https://start.dlndao.org/#/App/proposal?mfi=${mfiName}&id=${proposal.id}`
                      : `https://start.dlndao.org/#/App/proposal?mfi=ROI&id=${proposal.id}`
                  }
                  title={`I just posted an update on my @DLNDAO proposal ${proposal.title}, Check it out at`}
                  className={"d-none"}
                >
                  <TwitterIcon size={32} round />
                </TwitterShareButton>
              </div>
            </Col>
            <Col className={classNames(!isAdd ? "d-none" : "")}>
              <img
                className='app-action-icon'
                src={cancelIcon}
                alt='icon'
                onClick={(e) => handleCancel(e)}
              />
            </Col>
            {isBorrow && !isAdd && (
              <Col className='d-flex '>
                <div className='mx-auto mt-1'>
                  <img
                    className={classNames(
                      "app-action-icon",
                      isAdd ? "d-none" : ""
                    )}
                    src={deleteIcon}
                    alt='icon'
                    onClick={(e) => {
                      handleOpenModalDelete();
                    }}
                  />
                </div>
              </Col>
            )}
          </Row>
          {showDeleteModal && (
            <ConfirmationModal
              message={strings.confirmationDeleteProposalUpdate}
              ConfirmationModalConfirm={() => handleDelete(item.id)}
              ConfirmationModalCancel={() => setShowDeleteModal(false)}
            />
          )}
        </Col>
      </Row>
      <Row className='pl-4'>
        <Col>
          {showErrors === true && uploadImage === false && (
            <div className='text-left app-error-msg'>{strings.required}</div>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default SingleProposalImageLog;
