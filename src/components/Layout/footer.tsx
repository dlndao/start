import React, { Fragment, useRef, useState, useEffect } from "react";
import { Row, Col, Tooltip, Overlay } from "react-bootstrap";
import { Tooltip as MaterialToolTip } from "@material-ui/core";

import strings from "localization";

import dlnLogo from "Assets/Images/dlnLogo.png";
import helpIcon from "Assets/Images/icons/help.png";

function Footer() {
  const openDocs = useRef(null);
  const [isOpenDocsClicked, setIsOpenDocsClicked] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [emailText, setEmailText] = useState("");
  const [phoneText, setPhoneText] = useState("");

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
    setIsOpenDocsClicked(false);
  };

  //open documentation of dln in new tab
  const handleOpenDocs = () => {
    const DemoMode: any = localStorage.getItem("IsDemoMode");
    if (DemoMode === "true") {
      setIsDemoMode(DemoMode === "true" ? true : false);
      setIsOpenDocsClicked(!isOpenDocsClicked);
    } else {
      removeClickIcons();
      const docsUrl = window.open(
        "https://docs.dln.org/",
        "_blank",
        "noopener,noreferrer"
      );
      if (docsUrl) docsUrl.opener = null;
      removeClass();
    }
  };

  let storage: any = localStorage.getItem("mfiData");
  let mfiData: any = storage ? JSON.parse(storage) : null;
  let dlnPhoneNumber: any = "+222222";
  let dlnEmail: any = "Contact@DLN.org";
  const [phoneNumber, setPhoneNumber] = useState(dlnPhoneNumber);
  const [email, setEmail] = useState(dlnEmail);

  useEffect(() => {
    const language: any = localStorage.getItem("language");
    if (language) {
      strings.setLanguage(language);
    }
    setEmailText(strings.email);
    setPhoneText(strings.phone);
    if (mfiData) {
      setPhoneNumber(mfiData.phone);
      setEmail(mfiData.email);
    }
  }, [localStorage.getItem("mfiData")]);

  return (
    <Fragment>
      <Row className='app-footer text-center justify-content-between'>
        <Col>
          <Row className='justify-content-between mr-2 ml-2'>
            <Col className='col-auto'>
              <MaterialToolTip
                PopperProps={{ disablePortal: true }}
                classes={{
                  tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                  arrow: "dln-tooltip-arrow",
                }}
                arrow
                placement='top'
                title={strings.openDLNDocs}
              >
                <a onClick={handleOpenDocs} ref={openDocs}>
                  <img
                    src={helpIcon}
                    alt='dln logo'
                    className='mr-1 cursor-pointer  app-footer-help-icon'
                  />
                </a>
              </MaterialToolTip>
              <Overlay
                target={openDocs}
                show={isDemoMode === true && isOpenDocsClicked === true}
                placement='top'
              >
                {(props) => (
                  <Tooltip
                    id='overlay-fund'
                    className='dln-poppver-tooltip'
                    {...props}
                  >
                    {strings.openDLNDocs}
                    <p>{strings.userCanCheckDLNDocumentation}</p>
                  </Tooltip>
                )}
              </Overlay>
            </Col>
            <Col className='col-auto align-self-center app-footer-info'>
              {phoneText} {phoneNumber}
            </Col>

            <Col className='col-xl-auto col-lg-auto align-self-center  col-md-auto col-sm-12 text-right app-footer-info'>
              {emailText}
              <a
                className='dln-MFI-innerBox dln-text-underline'
                href={`mailto:${email}`}
              >
                {email}{" "}
              </a>
            </Col>
          </Row>

          <Row>
            {" "}
            <Col className='app-footer-content d-flex justify-content-center'>
              <img
                src={dlnLogo}
                alt='dln logo'
                className='mr-1 app-footer-logo'
              />
              <span>{strings.poweredByDLN}</span>
            </Col>
          </Row>
        </Col>
      </Row>
    </Fragment>
  );
}
export default Footer;
