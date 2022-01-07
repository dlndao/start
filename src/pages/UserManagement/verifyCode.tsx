import React, { Fragment, useEffect, useState, useRef } from "react";
import { Row, Col, Form, Spinner } from "react-bootstrap";
import { useHistory, useParams, withRouter } from "react-router-dom";
import { Auth } from "aws-amplify";

import { getMFIData } from "API/api";
import strings from "localization";

import Card from "components/Layout/layout";
import Menu from "components/Layout/menu";
import Footer from "components/Layout/footer";

import loader from "Assets/Images/loader.gif";

function VerifyCode(props) {
  const initialInputs = () => ({
    inputs: {
      verifyCode: "",
    },
  });

  let history: any = useHistory();
  let intervalRef: any = useRef();
  let { mfi }: any = useParams();

  const [state, setState] = useState(initialInputs());
  const [loading, setLoading] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [num, setNum] = useState(60);
  const [counter, setCounter] = useState(false);
  const [isResendClicked, setIsResendClicked] = useState(false);
  const [enterAPI, setEnterAPI] = useState(false);

  //count down of verification resend code
  const decreaseNum = () => {
    setNum((prev) => prev - 1);
    setCounter(!counter);
  };

  const handleClick = async () => {
    setShowErrors(true);
    let result: any;
    if (state.inputs.verifyCode !== "") {
      result = await Auth.confirmSignUp(phoneNumber, state.inputs.verifyCode);
      setShowErrors(false);

      if (result === "SUCCESS") {
        let storage: any = localStorage.getItem("mfiData");
        let mfiData: any = storage ? JSON.parse(storage) : null;
        if (mfiData?.name || mfi) {
          history.push(`/App/Login/${mfi ? mfi : mfiData?.name}`);
        } else {
          history.push(`/App/Login`);
        }
      }
    }
  };

  useEffect(() => {
    const _phoneNumber = props.location?.state?.phoneNumber;
    setPhoneNumber(_phoneNumber);
    const language: any = localStorage.getItem("language");
    if (language) {
      strings.setLanguage(language);
    }
    if (mfi) {
      handleMfi(mfi);
    } else {
      setEnterAPI(true);
    }
  }, []);

  // fetch mfi data
  const handleMfi = async (mfiName) => {
    const response: any = await getMFIData(mfiName);
    if (response) {
      setEnterAPI(true);
    } else {
      setEnterAPI(true);
    }
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    const { inputs } = state;

    inputs[name] = value;
    setState({
      ...state,
      inputs,
    });
  };

  const handleResend = async (e) => {
    setIsResendClicked(true);
    await Auth.resendSignUp(phoneNumber);
    let _num = num;
    intervalRef.current = setInterval(() => {
      if (_num <= 0) {
        setIsResendClicked(false);
        clearInterval(intervalRef.current);
        setNum(60);
      } else {
        _num = _num - 1;
        decreaseNum();
        console.log(num);
      }
    }, 1000);
  };

  return (
    <Fragment>
      {!enterAPI ? (
        <Row className='align-items-center h-100-vh'>
          <Col>
            <img src={loader} className='loader-img' width='200' />
          </Col>
        </Row>
      ) : (
        <Fragment>
          {enterAPI && <Menu isStart={true} />}
          <Card>
            <Form className='app-form'>
              <Row>
                <Col className='text-left'>
                  <Form.Group>
                    <Form.Control
                      type='text'
                      placeholder={strings.verifyCode}
                      value={state.inputs.verifyCode}
                      name='verifyCode'
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className='justify-content-between'>
                <Col className='text-left'>
                  <button
                    type='button'
                    className='app-primary-btn'
                    onClick={handleClick}
                    disabled={state.inputs.verifyCode.length <= 0}
                  >
                    {loading ? (
                      <Spinner
                        className='mr-1 dln-button-loader'
                        as='span'
                        animation='border'
                        role='status'
                        aria-hidden='true'
                      />
                    ) : (
                      strings.verify
                    )}
                  </button>
                </Col>
                <Col className='text-right'>
                  <button
                    className={`btn app-link ${
                      isResendClicked ? "disabled" : ""
                    }`}
                    onClick={handleResend}
                    type='button'
                  >
                    Resend Code
                  </button>
                  <br />
                  {isResendClicked && (
                    <span className='dln-text-mute'>
                      {" "}
                      Try again after {num} s
                    </span>
                  )}
                </Col>
              </Row>
            </Form>
          </Card>
          <Row className='justify-content-center'>
            <Col xl={7} lg={7} md={7} sm={12}>
              <Footer />
            </Col>
          </Row>
        </Fragment>
      )}
    </Fragment>
  );
}

export default withRouter(VerifyCode);
