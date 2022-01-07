import React, { Fragment, useState, useEffect } from "react";
import { Row, Col, Form, Spinner } from "react-bootstrap";
import classNames from "classnames";
import { Avatar } from "@material-ui/core";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { API, Storage } from "aws-amplify";
import { Tooltip as MaterialToolTip } from "@material-ui/core";
import validator from "validator";
import strings from "localization";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { TwitterIcon, TwitterShareButton } from "react-share";

import InviteUsers from "components/InviteInvestors";
import ConfirmationModal from "../Modals/confirmationModal";

import {
  deleteIcon,
  viewBlue,
  inviteIcon,
  saveIcon,
  cancelIcon,
} from "Assets/Images";

const initialInputs = () => ({
  inputs: {
    startDate: new Date(),
    endDate: new Date(),
    desc: "",
    title: "",
    campaignUrl: "",
    image: "",
    donationUrl: "",
  },
  isUpdateMode: false,
});

function CampaignCard({
  data,
  isAdd,
  CallAddProposalCanceled,
  callLoading,
  reloadCampaignsValue,
}) {
  let storage: any = localStorage.getItem("mfiData");
  let mfiData: any = storage ? JSON.parse(storage) : null;

  const [profileImg, setProfileImg] = useState("");
  const [state, setState] = useState(initialInputs());
  const [showErrors, setShowErrors] = useState(false);
  const [invalidDate, setInvalidDate] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [deleteCampaignId, setDeleteCampaignId] = useState();
  const [showInviteModal, setShowInviteModal] = useState(false);

  const fileInput: any = React.useRef<HTMLInputElement>();
  const [mfiId, setMFIID] = useState(false);
  const [uploadImage, setUploadImage] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileData, setFileData] = useState();
  const [fileType, setFileType] = useState();
  const [loadSave, setLoadSave] = useState(false);
  const [isShowTweet, setIsShowTweet] = useState(false);

  const handleChange = (e) => {
    const { value, name } = e.target;
    const { inputs } = state;

    inputs[name] = value;
    setState({
      ...state,
      inputs,
    });
  };

  useEffect(() => {
    if (mfiData) {
      setMFIID(mfiData.id);
    }
    if (!isAdd && data && data !== "") {
      setState({
        ...state,
        inputs: {
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          desc: data.description,
          title: data.name,
          campaignUrl: data.campaignUrl,
          image: data.image,
          donationUrl: mfiData.id == 1 ? "https://dcbs.in/donation/" : "",
        },
        isUpdateMode: isAdd,
      });
      setProfileImg(data.image);
    } else {
      setState({ ...state, isUpdateMode: true });
    }
  }, []);

  //share tweet in twitter
  const handleTweetCampaign = () => {
    setIsShowTweet(!isShowTweet);
  };

  //save campaign image to s3 bucket
  const saveImage = async (name, data, type) => {
    let fileKey;
    await Storage.put("campaignImages" + "/" + name, data, {
      contentType: type,
      level: "public",
    }).then((result) => {
      fileKey = result; //result.key;
    });
    return fileKey.key;
  };

  //prepare uploaded image to save it
  const upload = async (e) => {
    setUploadImage(true);
    setProfileImg(URL.createObjectURL(e.target.files[0]));
    let file = fileInput.current.files[0];
    let reader = new FileReader();
    reader.readAsArrayBuffer(file);
    setFileType(e.target.files[0].type);
    setFileName(
      state.inputs.title.replace(/\s/g, "") +
        "_" +
        e.target.files[0].name.replace(/\s/g, "")
    );
    reader.onload = async (event: any) => {
      setFileData(event.target.result);
    };
  };

  const handleDateChange = (date, name) => {
    const { inputs }: any = state;
    inputs[name] = date;
    var today = new Date();
    var isToday = today.toDateString() == state.inputs.endDate.toDateString();

    if (isToday) {
      setInvalidDate(true);
    } else {
      setInvalidDate(false);
    }
    setState({
      ...state,
      inputs,
    });
  };

  //reset campaigns data when cancel editing
  const handleCancel = () => {
    setState({
      ...state,
      isUpdateMode: false,
      inputs: {
        ...state.inputs,
        title: state.inputs.title,
        desc: state.inputs.desc,
        startDate: new Date(state.inputs.startDate),
        endDate: new Date(state.inputs.endDate),
      },
    });
    CallAddProposalCanceled();
  };

  //add new campaign
  const createNewCampaign = async () => {
    setShowErrors(true);
    var today = new Date();
    var isToday = today.toDateString() == state.inputs.endDate.toDateString();
    let key: any;
    if (uploadImage) {
      key = await saveImage(fileName, fileData, fileType);
    }
    var startD = new Date(state.inputs.startDate);
    var endD = new Date(state.inputs.endDate);
    if (isToday || startD > endD) {
      setInvalidDate(true);
    } else {
      setInvalidDate(false);
      if (
        state.inputs.title != "" ||
        state.inputs.desc != "" ||
        state.inputs.campaignUrl != ""
      ) {
        setLoadSave(true);
        await API.post("auth", "/api/campaign", {
          headers: { "Content-Type": "application/json" },
          body: {
            mfiId: mfiId,
            name: state.inputs.title,
            description: state.inputs.desc,
            startDate: state.inputs.startDate.toDateString(),
            endDate: state.inputs.endDate.toDateString(),
            campaignUrl: state.inputs.campaignUrl,
            image: key,
          },
        }).then(async (response) => {
          if (response.success == true) {
            setState({
              ...state,
              isUpdateMode: false,
            });
            //enable add button to work again
            CallAddProposalCanceled();
            reloadCampaignsValue();
            toast.success(strings.addedCampaign);
          } else {
            toast.error("error..");
          }
          setLoadSave(false);
        });
      }
    }
  };

  //delete campaign
  const deleteCampaign = async (id) => {
    await API.del("auth", `/api/campaign/`, {
      headers: { "Content-Type": "application/json" },
      body: { id: id },
    }).then(async (response) => {
      if (response.success == true) {
        toast.success(strings.campaignRemoved);
        callLoading();
      } else {
        toast.error("error..");
      }
    });
  };

  return (
    <Fragment>
      <Row className='justify-content-center app-inner-page app-inner-page-tab mt-3'>
        <Col
          xl={8}
          lg={8}
          md={8}
          sm={8}
          className={classNames("card app-card app-single-prop")}
        >
          <Form className='app-form py-4'>
            <Row>
              <Col className='col-auto app-user-profile-img-main text-left'>
                <MaterialToolTip
                  PopperProps={{ disablePortal: true }}
                  classes={{
                    tooltip: "dln-tooltip",
                    arrow: "dln-tooltip-arrow",
                  }}
                  arrow
                  placement='top'
                  title={strings.campaignImage}
                >
                  <label>
                    <Avatar
                      alt=''
                      src={profileImg}
                      className='app-user-profile-img app-proposal-img'
                    />
                    {isAdd && (
                      <input
                        accept='*/*'
                        className='d-none'
                        id='contained-button-file'
                        type='file'
                        ref={fileInput}
                        onChange={(e) => upload(e)}
                      />
                    )}
                  </label>
                </MaterialToolTip>
              </Col>
              <Col>
                <Row>
                  <Col className='text-center'>
                    <MaterialToolTip
                      PopperProps={{ disablePortal: true }}
                      classes={{
                        tooltip: "dln-tooltip",
                        arrow: "dln-tooltip-arrow",
                      }}
                      arrow
                      placement='top'
                      title={strings.campaignTitle}
                    >
                      <Form.Group>
                        <label className='w-100'>
                          <Form.Control
                            type='text'
                            placeholder={strings.campaignTitle}
                            name='title'
                            onChange={(e) => {
                              handleChange(e);
                            }}
                            value={state.inputs.title}
                            disabled={!state.isUpdateMode}
                          />
                        </label>
                        {showErrors === true &&
                          validator.isEmpty(state.inputs.title) && (
                            <div className='app-error-msg'>
                              {strings.required}
                            </div>
                          )}
                      </Form.Group>
                    </MaterialToolTip>
                  </Col>
                </Row>
                <Row>
                  <Col className='text-center'>
                    <MaterialToolTip
                      PopperProps={{ disablePortal: true }}
                      classes={{
                        tooltip: "dln-tooltip",
                        arrow: "dln-tooltip-arrow",
                      }}
                      arrow
                      placement='top'
                      title={strings.campaignUrl}
                    >
                      <Form.Group>
                        <label className='w-100'>
                          <div className='position-relative'>
                            <Form.Control
                              type='text'
                              placeholder={
                                state.isUpdateMode
                                  ? `${strings.campaignUrl}`
                                  : ""
                              }
                              name='campaignUrl'
                              onChange={(e) => {
                                handleChange(e);
                              }}
                              value={
                                state.isUpdateMode
                                  ? state.inputs.campaignUrl
                                    ? state.inputs.campaignUrl
                                    : ""
                                  : ""
                              }
                              disabled={!state.isUpdateMode}
                            />
                            <a
                              href={state.inputs.campaignUrl}
                              className={`position-absolute dln-donationURL text-truncate ${state.isUpdateMode &&
                                "d-none"}`}
                              target='_blank'
                              rel='noopener noreferrer'
                            >
                              {state.inputs.campaignUrl}
                            </a>
                          </div>
                        </label>
                        {showErrors === true &&
                          validator.isEmpty(state.inputs.campaignUrl) && (
                            <div className='app-error-msg'>
                              {strings.required}
                            </div>
                          )}
                      </Form.Group>
                    </MaterialToolTip>
                  </Col>
                </Row>
                <Row>
                  <Col className='text-center'>
                    <MaterialToolTip
                      PopperProps={{ disablePortal: true }}
                      classes={{
                        tooltip: "dln-tooltip",
                        arrow: "dln-tooltip-arrow",
                      }}
                      arrow
                      placement='top'
                      title={strings.donationUrl}
                    >
                      <Form.Group>
                        <label className='w-100'>
                          <div className='position-relative'>
                            <Form.Control
                              type='text'
                              placeholder={
                                state.isUpdateMode ? "Donation URL" : ""
                              }
                              name='donationUrl'
                              onChange={(e) => {
                                handleChange(e);
                              }}
                              value={
                                state.isUpdateMode
                                  ? state.inputs.donationUrl
                                    ? state.inputs.donationUrl
                                    : ""
                                  : ""
                              }
                              disabled={!state.isUpdateMode}
                            />
                            <a
                              href={state.inputs.donationUrl}
                              className={`position-absolute dln-donationURL text-truncate ${state.isUpdateMode &&
                                "d-none"}`}
                              target='_blank'
                              rel='noopener noreferrer'
                            >
                              {state.inputs.donationUrl}
                            </a>
                          </div>
                        </label>
                        {showErrors === true &&
                          validator.isEmpty(state.inputs.campaignUrl) && (
                            <div className='app-error-msg'>
                              {strings.required}
                            </div>
                          )}
                      </Form.Group>
                    </MaterialToolTip>
                  </Col>
                </Row>
                <Row>
                  <Col className='text-left'>
                    <MaterialToolTip
                      PopperProps={{ disablePortal: true }}
                      classes={{
                        tooltip: "dln-tooltip",
                        arrow: "dln-tooltip-arrow",
                      }}
                      arrow
                      placement='top'
                      title={strings.startDate}
                    >
                      <Form.Group>
                        <label className='dln-datepicker'>
                          <DatePicker
                            name='startDate'
                            className='form-control'
                            selected={state.inputs.startDate}
                            onChange={(date, name) =>
                              handleDateChange(date, "startDate")
                            }
                            popperPlacement='top'
                            disabled={!state.isUpdateMode}
                          />
                        </label>
                      </Form.Group>
                    </MaterialToolTip>
                  </Col>
                  <Col className='text-left'>
                    <MaterialToolTip
                      PopperProps={{ disablePortal: true }}
                      classes={{
                        tooltip: "dln-tooltip",
                        arrow: "dln-tooltip-arrow",
                      }}
                      arrow
                      placement='top'
                      title={strings.endDate}
                    >
                      <Form.Group>
                        <label className='dln-datepicker'>
                          <DatePicker
                            name='endDate'
                            className='form-control'
                            selected={state.inputs.endDate}
                            onChange={(date, name) =>
                              handleDateChange(date, "endDate")
                            }
                            popperPlacement='top'
                            disabled={!state.isUpdateMode}
                          />
                        </label>

                        {showErrors === true && invalidDate && (
                          <div className='app-error-msg'>
                            {strings.invalidDate}
                          </div>
                        )}
                      </Form.Group>
                    </MaterialToolTip>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col className='text-left'>
                <MaterialToolTip
                  PopperProps={{ disablePortal: true }}
                  classes={{
                    tooltip: "dln-tooltip",
                    arrow: "dln-tooltip-arrow",
                  }}
                  arrow
                  placement='top'
                  title={strings.campaignDesc}
                >
                  <Form.Group>
                    <label className='w-100'>
                      <Form.Control
                        type='text'
                        as='textarea'
                        placeholder={strings.campaignDesc}
                        name='desc'
                        maxLength={256}
                        onChange={(e) => {
                          handleChange(e);
                        }}
                        value={state.inputs.desc}
                        disabled={!state.isUpdateMode}
                      />
                    </label>
                    {showErrors === true &&
                      validator.isEmpty(state.inputs.title) && (
                        <div className='app-error-msg'>{strings.required}</div>
                      )}
                  </Form.Group>
                </MaterialToolTip>
              </Col>
            </Row>
            <Fragment>
              {!state.isUpdateMode ? (
                <Row>
                  <Col>
                    <MaterialToolTip
                      PopperProps={{ disablePortal: true }}
                      classes={{
                        tooltip: "dln-tooltip",
                        arrow: "dln-tooltip-arrow",
                      }}
                      arrow
                      placement='top'
                      title={strings.viewCampaignProposal}
                    >
                      <Link
                        to={`/App/proposalsByCampaign?mfi=${mfiData.name}&id=${data.id}`}
                      >
                        <img
                          className='app-action-icon'
                          src={viewBlue}
                          alt='icon'
                        />
                      </Link>
                    </MaterialToolTip>
                  </Col>
                  <Col>
                    <MaterialToolTip
                      PopperProps={{ disablePortal: true }}
                      classes={{
                        tooltip: "dln-tooltip",
                        arrow: "dln-tooltip-arrow",
                      }}
                      arrow
                      placement='top'
                      title={strings.inviteAnInvestor}
                    >
                      <img
                        className='app-action-icon cursor-pointer'
                        src={inviteIcon}
                        alt='icon'
                        onClick={(e) => setShowInviteModal(true)}
                      />
                    </MaterialToolTip>
                    {showInviteModal && (
                      <InviteUsers
                        data={data}
                        InviteModalClosed={() => {
                          setShowInviteModal(false);
                        }}
                        isBorrow={false}
                        isCampaign={true}
                      />
                    )}
                  </Col>
                  <Col>
                    <div className={"d-inline"}>
                      <TwitterShareButton
                        beforeOnClick={() => {
                          handleTweetCampaign();
                        }}
                        url={
                          mfiData
                            ? `https://start.dlndao.org/#/App/proposalsByCampaign?mfi=${mfiData.name}&id=${data.id}`
                            : `https://start.dlndao.org/#/App/proposalsByCampaign?mfi=ROI&id=${data.id}`
                        }
                        title={`I am supporting [${data.name}] campaign on @DLN , check it out at: `}
                        openShareDialogOnClick={!isShowTweet}
                      >
                        <TwitterIcon size={32} round />
                      </TwitterShareButton>
                    </div>
                  </Col>
                  <Col>
                    <MaterialToolTip
                      PopperProps={{ disablePortal: true }}
                      classes={{
                        tooltip: "dln-tooltip",
                        arrow: "dln-tooltip-arrow",
                      }}
                      arrow
                      placement='top'
                      title={strings.deleteThisCampaign}
                    >
                      <img
                        className='app-action-icon'
                        src={deleteIcon}
                        alt='icon'
                        onClick={(e) => {
                          setShowConfirmationModal(true);
                          setDeleteCampaignId(data.id);
                        }}
                      />
                    </MaterialToolTip>
                  </Col>
                </Row>
              ) : (
                <Row>
                  <Col>
                    <MaterialToolTip
                      PopperProps={{ disablePortal: true }}
                      classes={{
                        tooltip: "dln-tooltip",
                        arrow: "dln-tooltip-arrow",
                      }}
                      arrow
                      placement='top'
                      title={strings.publishThisCampaign}
                    >
                      {loadSave ? (
                        <Spinner
                          className='mr-1 dln-button-loader'
                          as='span'
                          animation='border'
                          role='status'
                          aria-hidden='true'
                        />
                      ) : (
                        <img
                          className='app-action-icon'
                          src={saveIcon}
                          alt='icon'
                          onClick={() => createNewCampaign()}
                        />
                      )}
                    </MaterialToolTip>
                  </Col>
                  <Col>
                    <MaterialToolTip
                      PopperProps={{ disablePortal: true }}
                      classes={{
                        tooltip: "dln-tooltip",
                        arrow: "dln-tooltip-arrow",
                      }}
                      arrow
                      placement='top'
                      title=''
                    >
                      <img
                        className='app-action-icon'
                        src={cancelIcon}
                        alt='icon'
                        onClick={() => handleCancel()}
                      />
                    </MaterialToolTip>
                  </Col>
                </Row>
              )}
              {showConfirmationModal && (
                <ConfirmationModal
                  message={`Are you need to archive "${data.name}" campaign?`}
                  ConfirmationModalConfirm={() =>
                    deleteCampaign(deleteCampaignId)
                  }
                  ConfirmationModalCancel={() =>
                    setShowConfirmationModal(false)
                  }
                />
              )}
            </Fragment>
          </Form>
        </Col>
      </Row>
    </Fragment>
  );
}

export default CampaignCard;
