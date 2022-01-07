import React, { Fragment, useState, useEffect, useRef } from "react";
import { Row, Col, Overlay, Tooltip } from "react-bootstrap";
import { Tooltip as MaterialToolTip } from "@material-ui/core";

import strings from "localization";
import { ProposalStatus } from "Enums/ProposalStatus";

import {
  bakedIcon,
  fundedIcon,
  publishIcon,
  draftIcon,
  lockIcon,
  repayIcon,
  bakedActiveIcon,
  fundedActiveIcon,
  publishActiveIcon,
  draftActiveIcon,
  lockActiveIcon,
  repayActiveIcon,
  allIcon,
  plusIcon,
} from "Assets/Images";

function FiltrationBar({
  isAddShow,
  isDraftShow,
  handleFilter,
  handleAddButton,
  parentClickedFilter = 0,
  isShowRepaid = true,
}) {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isAllButtonClicked, setIsAllButtonClicked] = useState(false);
  const [isDraftButtonClicked, setIsDraftButtonClicked] = useState(false);
  const [isRepayButtonClicked, setIsRepayButtonClicked] = useState(false);
  const [isPublishButtonClicked, setIsPublishButtonClicked] = useState(false);
  const [isFundedButtonClicked, setIsFundedButtonClicked] = useState(false);
  const [isLockedButtonClicked, setIsLockedButtonClicked] = useState(false);
  const [isBakedButtonClicked, setIsBakedButtonClicked] = useState(false);
  ///

  const addProposal = useRef(null);
  const allFilter = useRef(null);
  const draftProposal = useRef(null);
  const publishProposal = useRef(null);
  const lockProposal = useRef(null);
  const bakeProposal = useRef(null);
  const fundProposal = useRef(null);
  const repayProposal = useRef(null);

  //handle add new proposal icon click
  const handleAddProposal = () => {
    const DemoMode: any = localStorage.getItem("IsDemoMode");
    if (DemoMode === "true") {
      removeClickIcons();
      setIsDemoMode(DemoMode === "true" ? true : false);
      setIsButtonClicked(!isButtonClicked);
    } else {
      removeClickIcons();
      handleAddButton();
      removeClass();
    }
  };

  //remove normal tooltips after activate demo mode
  const removeClass = () => {
    let tooltip = document.getElementsByClassName("dln-poppver-tooltip");
    if (tooltip) {
      for (var ele of tooltip) {
        ele.classList.add("d-none");
        ele.classList.remove("show");
      }
    }
  };

  //close all demo mode popovers
  const removeClickIcons = () => {
    setIsAllButtonClicked(false);
    setIsButtonClicked(false);
    setIsRepayButtonClicked(false);
    setIsFundedButtonClicked(false);
    setIsDraftButtonClicked(false);
    setIsLockedButtonClicked(false);
    setIsBakedButtonClicked(false);
    setIsPublishButtonClicked(false);
  };

  //set choosed filter
  const handleClickFilter = (filter) => {
    const DemoMode: any = localStorage.getItem("IsDemoMode");
    if (DemoMode === "true") {
      removeClickIcons();
      setIsDemoMode(DemoMode === "true" ? true : false);
      if (filter === ProposalStatus.drafted) {
        setIsDraftButtonClicked(!isDraftButtonClicked);
      } else if (filter == ProposalStatus.published) {
        setIsPublishButtonClicked(!isPublishButtonClicked);
      } else if (filter == ProposalStatus.locked) {
        setIsLockedButtonClicked(!isLockedButtonClicked);
      } else if (filter == ProposalStatus.backed) {
        setIsBakedButtonClicked(!isBakedButtonClicked);
      } else if (filter == ProposalStatus.funded) {
        setIsFundedButtonClicked(!isFundedButtonClicked);
      } else if (filter == ProposalStatus.repaid) {
        setIsRepayButtonClicked(!isRepayButtonClicked);
      } else {
        setIsAllButtonClicked(!isAllButtonClicked);
      }
    } else {
      removeClass();
      removeClickIcons();
      handleFilter(filter);
    }
  };
  useEffect(() => {
    (async () => {
      const language: any = localStorage.getItem("language");
      if (language) {
        strings.setLanguage(language);
      }
    })();
  }, []);

  return (
    <Fragment>
      <Row className='mt-3 mr-1 ml-1 app-filter-bar'>
        {isAddShow && (
          <div className='pl-0 col-auto d-flex align-self-end'>
            <div className='app-action-container'>
              <MaterialToolTip
                PopperProps={{ disablePortal: true }}
                classes={{
                  tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                  arrow: "dln-tooltip-arrow",
                }}
                arrow
                placement='top'
                title={strings.addNewProposal}
              >
                <img
                  className='app-action-icon'
                  src={plusIcon}
                  alt='icon'
                  onClick={handleAddProposal}
                  ref={addProposal}
                />
              </MaterialToolTip>
              <Overlay
                target={addProposal}
                show={isDemoMode === true && isButtonClicked === true}
                placement='top'
              >
                {(props) => (
                  <Tooltip
                    id='overlay-add'
                    className='dln-poppver-tooltip'
                    {...props}
                  >
                    {strings.addNewProposal}
                    <p>{strings.addNewProposalDesc}</p>
                  </Tooltip>
                )}
              </Overlay>
            </div>
          </div>
        )}
        <div className='pl-0 d-flex align-self-end ml-2'>
          <div className='app-action-container'>
            <MaterialToolTip
              PopperProps={{ disablePortal: true }}
              classes={{
                tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                arrow: "dln-tooltip-arrow",
              }}
              arrow
              placement='top'
              title={strings.allProposals}
            >
              <img
                className='app-action-icon'
                src={allIcon}
                alt='icon'
                onClick={(e) => handleClickFilter(0)}
                ref={allFilter}
              />
            </MaterialToolTip>
            <Overlay
              target={allFilter}
              show={isDemoMode === true && isAllButtonClicked === true}
              placement='top'
            >
              {(props) => (
                <Tooltip
                  id='overlay-all'
                  className='dln-poppver-tooltip'
                  {...props}
                >
                  {strings.allProposals}
                  <p>{strings.allProposalsDesc}</p>
                </Tooltip>
              )}
            </Overlay>
          </div>
        </div>
        <Col
          className={
            isDraftShow
              ? "col app-progress-filter"
              : "col-auto app-progress-filter"
          }
        >
          <div className='app-text-gray'>{strings.progress}</div>
          <div className='app-filters-container'>
            {isDraftShow && (
              <Fragment>
                <MaterialToolTip
                  PopperProps={{ disablePortal: true }}
                  classes={{
                    tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                    arrow: "dln-tooltip-arrow",
                  }}
                  arrow
                  placement='top'
                  title={strings.selectDraftedProposals}
                >
                  <img
                    id='drafted'
                    className={`app-action-icon`}
                    src={
                      parentClickedFilter === ProposalStatus.drafted
                        ? draftActiveIcon
                        : draftIcon
                    }
                    alt='icon'
                    onClick={(e) => handleClickFilter(ProposalStatus.drafted)}
                    ref={draftProposal}
                  />
                </MaterialToolTip>
                <Overlay
                  target={draftProposal}
                  show={isDemoMode === true && isDraftButtonClicked === true}
                  placement='top'
                >
                  {(props) => (
                    <Tooltip
                      id='overlay-draft'
                      className='dln-poppver-tooltip'
                      {...props}
                    >
                      {strings.selectDraftedProposals}
                      <p>{strings.selectDraftedProposalsDesc}</p>
                    </Tooltip>
                  )}
                </Overlay>
              </Fragment>
            )}
            <MaterialToolTip
              PopperProps={{ disablePortal: true }}
              classes={{
                tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                arrow: "dln-tooltip-arrow",
              }}
              arrow
              placement='top'
              title={strings.selectPublishedProposals}
            >
              <img
                className='app-action-icon'
                src={
                  parentClickedFilter === ProposalStatus.published
                    ? publishActiveIcon
                    : publishIcon
                }
                alt='icon'
                onClick={(e) => handleClickFilter(ProposalStatus.published)}
                ref={publishProposal}
              />
            </MaterialToolTip>
            <Overlay
              target={publishProposal}
              show={isDemoMode === true && isPublishButtonClicked === true}
              placement='top'
            >
              {(props) => (
                <Tooltip
                  id='overlay-publish'
                  className='dln-poppver-tooltip'
                  {...props}
                >
                  {strings.selectPublishedProposals}
                  <p>{strings.selectPublishedProposalsDesc}</p>
                </Tooltip>
              )}
            </Overlay>
          </div>
        </Col>
        <Col sm xs='12' className='px-0'>
          <div className='app-text-gray'>{strings.active}</div>
          <div className='app-filters-container mr-1 ml-1'>
            <MaterialToolTip
              PopperProps={{ disablePortal: true }}
              classes={{
                tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                arrow: "dln-tooltip-arrow",
              }}
              arrow
              placement='top'
              title={strings.selectLockedProposals}
            >
              <img
                className='app-action-icon'
                src={
                  parentClickedFilter === ProposalStatus.locked
                    ? lockActiveIcon
                    : lockIcon
                }
                alt='icon'
                onClick={(e) => handleClickFilter(ProposalStatus.locked)}
                ref={lockProposal}
              />
            </MaterialToolTip>
            <Overlay
              target={lockProposal}
              show={isDemoMode === true && isLockedButtonClicked === true}
              placement='top'
            >
              {(props) => (
                <Tooltip
                  id='overlay-lock'
                  className='dln-poppver-tooltip'
                  {...props}
                >
                  {strings.selectLockedProposals}
                  <p>{strings.selectLockedProposalsDesc}</p>
                </Tooltip>
              )}
            </Overlay>
            <MaterialToolTip
              PopperProps={{ disablePortal: true }}
              classes={{
                tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                arrow: "dln-tooltip-arrow",
              }}
              arrow
              placement='top'
              title={strings.selectBackedProposals}
            >
              <img
                className='app-action-icon'
                src={
                  parentClickedFilter === ProposalStatus.backed
                    ? bakedActiveIcon
                    : bakedIcon
                }
                alt='icon'
                onClick={(e) => handleClickFilter(ProposalStatus.backed)}
                ref={bakeProposal}
              />
            </MaterialToolTip>
            <Overlay
              target={bakeProposal}
              show={isDemoMode === true && isBakedButtonClicked === true}
              placement='top'
            >
              {(props) => (
                <Tooltip
                  id='overlay-bake'
                  className='dln-poppver-tooltip'
                  {...props}
                >
                  {strings.selectBackedProposals}
                  <p>{strings.selectBackedProposalsDesc}</p>
                </Tooltip>
              )}
            </Overlay>
            <MaterialToolTip
              PopperProps={{ disablePortal: true }}
              classes={{
                tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                arrow: "dln-tooltip-arrow",
              }}
              arrow
              placement='top'
              title={strings.selectFundedProposals}
            >
              <img
                className='app-action-icon'
                src={
                  parentClickedFilter === ProposalStatus.funded
                    ? fundedActiveIcon
                    : fundedIcon
                }
                alt='icon'
                onClick={(e) => handleClickFilter(ProposalStatus.funded)}
                ref={fundProposal}
              />
            </MaterialToolTip>

            <Overlay
              target={fundProposal}
              show={isDemoMode === true && isFundedButtonClicked === true}
              placement='top'
            >
              {(props) => (
                <Tooltip
                  id='overlay-fund'
                  className='dln-poppver-tooltip'
                  {...props}
                >
                  {strings.selectFundedProposals}
                  <p>{strings.selectFundedProposalsDesc}</p>
                </Tooltip>
              )}
            </Overlay>
            {isShowRepaid && (
              <MaterialToolTip
                PopperProps={{ disablePortal: true }}
                classes={{
                  tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                  arrow: "dln-tooltip-arrow",
                }}
                arrow
                placement='top'
                title={strings.selectRepaidProposals}
              >
                <img
                  className='app-action-icon'
                  src={
                    parentClickedFilter === ProposalStatus.repaid
                      ? repayActiveIcon
                      : repayIcon
                  }
                  alt='icon'
                  onClick={(e) => handleClickFilter(ProposalStatus.repaid)}
                  ref={repayProposal}
                />
              </MaterialToolTip>
            )}
            <Overlay
              target={repayProposal}
              show={isDemoMode === true && isRepayButtonClicked === true}
              placement='top'
            >
              {(props) => (
                <Tooltip
                  id='overlay-repay'
                  className='dln-poppver-tooltip'
                  {...props}
                >
                  {strings.selectRepaidProposals}
                  <p>{strings.selectRepaidProposalsDesc}</p>
                </Tooltip>
              )}
            </Overlay>
          </div>
        </Col>
      </Row>
    </Fragment>
  );
}
export default FiltrationBar;
