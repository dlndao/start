import React, { Fragment, useEffect, useState } from "react";
import { Row, Col, Form, Spinner } from "react-bootstrap";
import { useHistory, useParams, Link } from "react-router-dom";
import { API, Auth } from "aws-amplify";

import { getMFIData } from "API/api";
import strings from "localization";

import Menu from "components/Layout/menu";
import Card from "components/Layout/layout";
import Footer from "components/Layout/footer";

import loader from "Assets/Images/loader.gif";

function Login() {
  const history: any = useHistory();
  const href = window.location.href;
  const { mfi }: any = useParams();

  const initialInputs = () => ({
    inputs: {
      phoneNumber: "",
      password: "",
    },
  });
  const [state, setState] = useState(initialInputs());
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const [enterAPI, setEnterAPI] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      let phoneNumber = state.inputs.phoneNumber.trim().startsWith("+")
        ? state.inputs.phoneNumber.trim().toLowerCase()
        : "+" + state.inputs.phoneNumber.trim().toLowerCase();

      const currentUser = await Auth.signIn(phoneNumber, state.inputs.password);

      if (currentUser.challengeName === "NEW_PASSWORD_REQUIRED") {
        const location = {
          pathname: "/App/ResetPassword",
          state: {
            identity: {
              filteredIdentity: phoneNumber,
              password: state.inputs.password,
            },
            challengeName: "NEW_PASSWORD_REQUIRED",
          },
        };
        setLoading(false);
        history.push(location);
      } else {
        let currentUserInfo = await Auth.currentUserInfo();

        let isPhoneVerified = currentUserInfo.attributes.phone_number_verified;

        if (!isPhoneVerified) {
          await Auth.verifyCurrentUserAttribute("phone_number");
          const location = {
            pathname: "/App/VerifyCode",
            state: {
              phoneNumber: phoneNumber,
            },
          };
          setLoading(false);
          history.push(location);
        } else {
          const userData = await API.get("auth", "/api/auth/", {
            headers: { "Content-Type": "application/json" },
            queryStringParameters: { username: currentUser.attributes.sub },
          });
          if (userData) {
            localStorage.removeItem("userData");
            localStorage.setItem("userData", JSON.stringify(userData.data));
          }
          setLoading(false);
          if (userData.data.userMfis.length > 0) {
            handleMfi(userData.data.userMfis[0].mfiName);
            setTimeout(function() {
              history.push("/App/MFIProposals");
            }, 1000);
          } else {
            history.push("/App/Home");
          }
        }
      }
    } catch (error) {
      setLoading(false);
      setLoginError(error.message);
    }
  };

  useEffect(() => {
    const language: any = localStorage.getItem("language");
    if (language) {
      strings.setLanguage(language);
    }
    localStorage.removeItem("userData");
    if (mfi) {
      handleMfi(mfi);
    } else {
      setEnterAPI(true);
      localStorage.removeItem("mfiData");
    }
  }, [href, mfi]);

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

  return (
    <Fragment>
      {!enterAPI ? (
        <Row className='align-items-center h-100-vh'>
          <Col>
            <img src={loader} alt='loader' className='loader-img' width='200' />
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
                    <Form.Label>{strings.phone}</Form.Label>
                    <Form.Control
                      type='text'
                      placeholder={strings.phone}
                      value={state.inputs.phoneNumber}
                      name='phoneNumber'
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className='text-left'>
                  <Form.Group>
                    <Form.Label>{strings.password}</Form.Label>
                    <Form.Control
                      type='password'
                      placeholder={strings.password}
                      value={state.inputs.password}
                      name='password'
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className='text-left'>
                  {loginError !== "" && (
                    <div className='app-error-msg'>{loginError}</div>
                  )}
                </Col>
              </Row>
              <button
                type='button'
                className='app-primary-btn'
                onClick={handleClick}
                disabled={
                  state.inputs.password.length <= 0 ||
                  state.inputs.phoneNumber.length <= 0 ||
                  loading
                }
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
                  strings.login
                )}
              </button>

              <div className='mt-3'>
                <Link to='/App/ForgotPassword' className='app-link'>
                  {strings.forgotPassword}
                </Link>
              </div>
            </Form>
          </Card>
          {enterAPI && (
            <Row className='justify-content-center'>
              <Col xl={7} lg={7} md={7} sm={12}>
                <Footer />
              </Col>
            </Row>
          )}
        </Fragment>
      )}
    </Fragment>
  );
}

export default Login;
