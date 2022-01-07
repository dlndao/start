import React, { useState, useEffect } from "react";
import { Modal, ModalBody } from "react-bootstrap";
import classNames from "classnames";
import { Row, Col } from "react-bootstrap";
import { API } from "aws-amplify";

import strings from "localization";

import SingleProposalImageLog from "../ProposalUpdates/singleProposalImageLog";

import loader from "Assets/Images/loader.gif";
import plus from "Assets/Images/icons/plus.png";

function ProposalImagesLog({ photoLogClosed, proposal, isBorrow }) {
  const [showAlbumModal, setShowAlbumModal]: any = useState(true);
  const [imagesObject, setImagesObject]: any = useState();
  const [addClicked, setAddClicked] = useState(false);
  const [isArabic, setIsArabic] = useState(false);
  const [loadUpdates, setLoadUpdates] = useState(false);

  //close modal, call parent functionality on close
  const handleCloseModal = () => {
    setShowAlbumModal(false);
    photoLogClosed();
  };

  useEffect(() => {
    (async () => {
      //setting current language
      const language: any = localStorage.getItem("language");
      if (language) {
        strings.setLanguage(language);
        if (language === "ar") {
          setIsArabic(true);
        } else {
          setIsArabic(false);
        }
      }
      getUpdates();
    })();
  }, []);

  //add new update to proposal (provide update to proposal by adding image and description to it)
  const handleAddImage = (e) => {
    setAddClicked(true);
  };

  //fetch previous updates
  const getUpdates = async () => {
    setLoadUpdates(true);
    await API.get("auth", "/api/borrow/proposalImages", {
      headers: { "Content-Type": "application/json" },
      queryStringParameters: { proposalId: proposal.id },
    }).then((response) => {
      if (response.success) {
        setImagesObject(response.data);
        setLoadUpdates(false);
      }
    });
  };

  return (
    <Modal
      show={showAlbumModal}
      onHide={() => {
        handleCloseModal();
      }}
      size='xl'
      backdrop='static'
      className={classNames(
        "dln-centered-vertically-modal",
        isArabic && "app-arabic-lang"
      )}
      scrollable={true}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <div>{proposal.title}</div>
        </Modal.Title>
      </Modal.Header>
      <ModalBody className='app-album-log-body'>
        {isBorrow && (
          <div className='app-add-new-img-object'>
            <img
              src={plus}
              alt='Add image'
              className='app-action-icon p-r-30'
              onClick={(e) => handleAddImage(e)}
            />
          </div>
        )}
        {addClicked && (
          <Row className='justify-content-center'>
            <Col className='col-lg-8 col-md-8 col-sm-12'>
              <SingleProposalImageLog
                item=''
                isAdd={true}
                CallAddProposalCanceled={() => setAddClicked(false)}
                callSpinner={() => getUpdates()}
                isBorrow={isBorrow}
                proposal={proposal}
              />
            </Col>
          </Row>
        )}
        {loadUpdates ? (
          <Row className='align-items-center'>
            <Col className='text-center'>
              <img src={loader} className='loader-img' width='200' />
            </Col>
          </Row>
        ) : imagesObject && imagesObject.length > 0 ? (
          imagesObject.map((item, index) => (
            <Row key={index} className='justify-content-center'>
              <Col className='col-lg-8 col-md-8 col-sm-12'>
                <SingleProposalImageLog
                  item={item}
                  isAdd={false}
                  CallAddProposalCanceled={() => setAddClicked(false)}
                  proposal={proposal}
                  callSpinner={() => getUpdates()}
                  isBorrow={isBorrow}
                />
              </Col>
            </Row>
          ))
        ) : (
          <h4 className='text-center'>{strings.noDataToShow}</h4>
        )}
      </ModalBody>
    </Modal>
  );
}

export default ProposalImagesLog;
