import React, { useState, useEffect } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import classNames from "classnames";

import strings from "localization";

function ConfirmationModal({
  message,
  ConfirmationModalConfirm,
  ConfirmationModalCancel,
}) {
  const [showConfirmModal, setShowConfirmModal]: any = useState(true);
  const [isArabic, setIsArabic] = useState(false);

  useEffect(() => {
    //setting current language
    const language: any = localStorage.getItem("language");
    if (language) {
      strings.setLanguage(language);
      if (language === "ar") {
        setIsArabic(true);
      } else {
        setIsArabic(false);
      }
    } else {
      setIsArabic(false);
    }
  }, []);

  //close modal, call parent functionality on close
  const handleCloseModal = () => {
    setShowConfirmModal(false);
    ConfirmationModalCancel();
  };

  const handleConfirmModal = () => {
    ConfirmationModalConfirm();
  };

  return (
    <Modal
      show={showConfirmModal}
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
          {strings.confirmation}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>{message}</h5>
      </Modal.Body>
      <Modal.Footer>
        <Row>
          <Col className='justify-content-end d-flex'>
            <button
              className='btn app-link text-dangel'
              onClick={() => {
                handleCloseModal();
              }}
            >
              {strings.no}
            </button>
            <button
              className='btn app-link text-success'
              onClick={() => {
                handleConfirmModal();
              }}
            >
              {strings.yes}
            </button>
          </Col>
        </Row>
      </Modal.Footer>
    </Modal>
  );
}
export default ConfirmationModal;
