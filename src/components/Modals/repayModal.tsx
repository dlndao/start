import React, { Fragment, useState, useEffect } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import classNames from "classnames";
import { Tooltip } from "@material-ui/core";
import { API } from "aws-amplify";

import strings from "localization";

import loader from "Assets/Images/loader.gif";
import {
  plusLight,
  saveIcon,
  cancelIcon,
  warning,
  rightSign,
} from "Assets/Images";

function RepayModal({
  data,
  RepayModalClosed,
  isBorrow = false,
  ismfi = false,
}) {
  const [showBakersModal, setShowBakersModal]: any = useState(true);
  const [loadRepay, setLoadRepay] = useState(false);
  const [isArabic, setIsArabic] = useState(false);
  const [addNewRepayment, setAddNewRepayment] = useState(false);
  const [paid, setPaid] = useState(0);
  const [inputValue, setInput] = useState(0);

  //close modal, call parent functionality on close
  const handleCloseModal = () => {
    setShowBakersModal(false);
    RepayModalClosed();
  };

  const initialPayment = () => [
    {
      amount: 0,
      isApproved: false,
      date: "",
    },
  ];

  //add new request row
  const addNewRequest = () => {
    setAddNewRepayment(true);
  };

  const [proposalPayment, setProposalPayment] = useState(initialPayment());

  const handleChange = (e: any) => {
    const { value, name } = e.target;
    setInput(value);
  };

  //approve added requests
  const approvePendingRequest = async (item) => {
    if (ismfi) {
      if (window.confirm("Are you sure you want to approve this payment?")) {
        setLoadRepay(true);
        let approve = await API.patch("auth", "/api/borrow/approvePayment", {
          headers: { "Content-Type": "application/json" },
          queryStringParameters: { proposalId: item.proposalId, id: item.id },
        });
        if (approve.success) {
          getPaymentLog();
        }
      }
    }
  };

  //save new repay to DB
  const addNewRepay = async (balance) => {
    if (balance != 0) {
      setLoadRepay(true);
      let data2 = localStorage.getItem("userData");
      if (data2) {
        const userData = JSON.parse(data2);
        let repay = await API.post("auth", "/api/borrow/proposalPayment", {
          headers: { "Content-Type": "application/json" },
          body: { userId: userData.id, proposalId: data.id, amount: balance },
        });
        if (repay.success) {
          let newPayment = {
            amount: repay.data.amount,
            date: repay.data.date,
            isApproved: repay.data.isApproved,
          };
          setProposalPayment([...proposalPayment, newPayment]);
        }
      }
      setAddNewRepayment(false);
      setLoadRepay(false);
    }
  };

  //show payments history
  const getPaymentLog = async () => {
    setLoadRepay(true);
    const proposalPayments = await API.get(
      "auth",
      "/api/borrow/proposalPayments",
      {
        headers: { "Content-Type": "application/json" },
        queryStringParameters: { proposalId: data.id },
      }
    );
    if (proposalPayments.success) {
      setProposalPayment(proposalPayments.data);
    }
    setLoadRepay(false);
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
      getPaymentLog();
    })();
    let paidValue = 0;
    paidValue = data.amount - data.currentBalance;
    setPaid(paidValue);
  }, []);

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
          {strings.paymentFor}: {data.title} proposal
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loadRepay ? (
          <Row className='align-items-center'>
            <Col className='text-center'>
              <img src={loader} className='loader-img' width='200' />
            </Col>
          </Row>
        ) : (
          <Fragment>
            <div>
              <Row>
                <Col className='col-3 pt-3'>
                  <div className='d-flex justify-content-center'>
                    <img
                      src={plusLight}
                      alt='icon'
                      className='app-action-icon'
                      onClick={() => addNewRequest()}
                      // ref={uploadImagesref}
                    />
                  </div>
                </Col>
                <Col className='col-9 '>
                  <Row>
                    <Col className='col-4'>
                      <div className='d-flex justify-content-center'>
                        {strings.funded}
                      </div>
                      <div className='d-flex justify-content-center dln-funded-value'>
                        {data.amount}
                      </div>
                    </Col>
                    <Col className='col-4'>
                      <div className='d-flex justify-content-center'>
                        {strings.outstanding}
                      </div>
                      <div className='d-flex justify-content-center dln-outstanding-value'>
                        {data.currentBalance}
                      </div>
                    </Col>
                    <Col className='col-4'>
                      <div className='d-flex justify-content-center'>
                        {strings.paid}
                      </div>
                      <div className='d-flex justify-content-center dln-paid-value'>
                        {paid}
                      </div>
                    </Col>
                  </Row>
                  {addNewRepayment ? (
                    <div>
                      <Row className='pt-4 '>
                        <Col className='col-6'>
                          <input
                            type='number'
                            name='repay-value'
                            className='form-control'
                            onChange={handleChange}
                            placeholder={strings.amountToRepay}
                            value={inputValue == 0 ? "" : inputValue}
                          />
                        </Col>
                        <Col className='col-6'>
                          <div className='d-flex justify-content-center'>
                            {strings.date}
                          </div>
                        </Col>
                      </Row>
                      <Row className='pt-4 '>
                        <Col className='col-6'>
                          <div className='d-flex justify-content-center'>
                            <img
                              src={saveIcon}
                              alt='icon'
                              className='app-action-icon'
                              onClick={() => addNewRepay(inputValue)}
                              // ref={uploadImagesref}
                            />
                          </div>
                        </Col>
                        <Col className='col-6'>
                          <div className='d-flex justify-content-center'>
                            <img
                              src={cancelIcon}
                              alt='icon'
                              className='app-action-icon'
                              onClick={() => setAddNewRepayment(false)}
                              // ref={uploadImagesref}
                            />
                          </div>
                        </Col>
                      </Row>
                    </div>
                  ) : null}
                </Col>
              </Row>
              {proposalPayment
                ? proposalPayment.map((item, index) => (
                    <Row className='pt-3' key={index}>
                      <Col className='col-4'>
                        <div className='d-flex justify-content-center'>
                          <Tooltip
                            classes={{
                              tooltip: "dln-tooltip",
                              arrow: "dln-tooltip-arrow",
                            }}
                            arrow
                            placement='top'
                            title={
                              item.isApproved
                                ? strings.confirmedByInvestor
                                : strings.pending
                            }
                          >
                            <img
                              src={item.isApproved ? rightSign : warning}
                              alt='icon'
                              className='app-action-icon'
                              onClick={() =>
                                !item.isApproved
                                  ? approvePendingRequest(item)
                                  : null
                              }
                            />
                          </Tooltip>
                        </div>
                      </Col>
                      <Col className='col-4'>
                        <div className='d-flex justify-content-center dln-background-lightGray'>
                          {item.amount}
                        </div>
                      </Col>
                      <Col className='col-4'>
                        <div className='d-flex justify-content-center '>
                          {item.date.slice(0, 10)}
                        </div>
                      </Col>
                    </Row>
                  ))
                : null}
            </div>
          </Fragment>
        )}
      </Modal.Body>
    </Modal>
  );
}
export default RepayModal;
