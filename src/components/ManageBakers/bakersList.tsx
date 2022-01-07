import React, { Fragment, useState, useEffect } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import { API } from "aws-amplify";
import classNames from "classnames";

import strings from "localization";

import SingleBaker from "./singleBaker";

import loader from "Assets/Images/loader.gif";

//displaying all backers who already baked proposal or invited to bake
function BakersList({ data, BakersModalClosed, isBorrow = false }) {
  const [showBakersModal, setShowBakersModal]: any = useState(true);
  const [bakers, setBakers]: any = useState();
  const [loadBakers, setLoadBakers] = useState(false);
  const [isArabic, setIsArabic] = useState(false);

  //close bakers list modal, call parent functionality on close
  const handleCloseModal = () => {
    setShowBakersModal(false);
    BakersModalClosed();
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
      getBakers();
    })();
  }, []);

  //fetch backers list
  const getBakers = async () => {
    setLoadBakers(true);

    const bakers = await API.get("auth", "/api/borrow/backersList", {
      headers: { "Content-Type": "application/json" },
      queryStringParameters: { proposalId: data.id },
    });
    if (data.status === 6) {
      setBakers(bakers.data.filter((baker) => baker.dateBacked !== null));
    } else {
      setBakers(bakers.data);
    }
    setLoadBakers(false);
  };

  return (
    <Modal
      show={showBakersModal}
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
          {strings.backersListFor} {data.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loadBakers ? (
          <Row className='align-items-center'>
            <Col className='text-center'>
              <img src={loader} className='loader-img' width='200' />
            </Col>
          </Row>
        ) : (
          <Fragment>
            {bakers &&
              bakers?.map((b: any, index) => (
                <Row key={index}>
                  <Col>
                    <SingleBaker
                      proposalData={data}
                      data={b}
                      closeModal={() => handleCloseModal}
                      isBorrow={isBorrow}
                    />
                  </Col>
                </Row>
              ))}
            {bakers && bakers.length <= 0 && (
              <Row className='mt-4'>
                <Col className='text-center'>
                  <h5>{strings.noDataToShow}</h5>
                </Col>
              </Row>
            )}
          </Fragment>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default BakersList;
