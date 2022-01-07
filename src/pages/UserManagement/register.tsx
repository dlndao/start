import React, { Fragment, useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import { Row, Col, Form, Spinner } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import validator from "validator";
import { API, Auth } from "aws-amplify";
import { toast } from "react-toastify";

import { getMFIData } from "API/api";
import strings from "localization";

import Card from "components/Layout/layout";
import Menu from "components/Layout/menu";
import Footer from "components/Layout/footer";

import loader from "Assets/Images/loader.gif";

function Register() {
  const initialInputs = () => ({
    inputs: {
      firstName: "",
      lastName: "",
      email: "",
      bio: "",
      password: "",
      confirmPassword: "",
      isPoliceRead: false,
    },
  });

  const href = window.location.href;
  let { mfi }: any = useParams();

  const history: any = useHistory();
  const [state, setState] = useState(initialInputs());
  const [showErrors, setShowErrors] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isClickable, setClickable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [enterAPI, setEnterAPI] = useState(false);

  const handleClick = async () => {
    setShowErrors(true);
    try {
      if (
        state.inputs.firstName !== "" &&
        state.inputs.lastName !== "" &&
        state.inputs.email !== "" &&
        phoneNumber !== "" &&
        state.inputs.password !== "" &&
        state.inputs.confirmPassword !== "" &&
        state.inputs.confirmPassword === state.inputs.password &&
        state.inputs.isPoliceRead
      ) {
        if (state.inputs.password.length < 8) {
          return;
        }
        setLoading(true);
        const user = await checkIsUserExist(state.inputs.email, phoneNumber);
        if (user) {
          setLoading(false);
          return;
        }
        //congnito saving
        const registeredUser = await Auth.signUp({
          username: phoneNumber.trim().startsWith("+")
            ? phoneNumber.trim().toLowerCase()
            : "+" + phoneNumber.trim().toLowerCase(),
          password: state.inputs.password,
          attributes: {
            phone_number: phoneNumber.trim().startsWith("+")
              ? phoneNumber.trim().toLowerCase()
              : "+" + phoneNumber.trim().toLowerCase(),
          },
        });

        //DB saving
        await API.post("auth", `/api/users`, {
          headers: {},
          body: {
            firstName: state.inputs.firstName,
            lastName: state.inputs.lastName,
            phone: phoneNumber.trim().startsWith("+")
              ? phoneNumber.trim().toLowerCase()
              : "+" + phoneNumber.trim().toLowerCase(),
            email: state.inputs.email,
            bio: state.inputs.bio,
            username: registeredUser.userSub,
          },
        }).then((response) => {});
        await Auth.signOut({ global: true });
        const location = {
          pathname: "/App/VerifyCode",
          state: {
            phoneNumber: phoneNumber.trim().startsWith("+")
              ? phoneNumber.trim().toLowerCase()
              : "+" + phoneNumber.trim().toLowerCase(),
          },
        };
        setLoading(false);
        history.push(location);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  const checkIsUserExist = async (email, phone) => {
    const isUser = await API.get("auth", "/api/auth/userExists", {
      headers: { "Content-Type": "application/json" },
      queryStringParameters: { email: email, phone: phone },
    });

    if (isUser.data.byEmail && isUser.data.byPhone) {
      toast.warning(strings.phoneAndEmailAlreadyEx);
      return true;
    } else if (isUser.data.byEmail) {
      toast.warning(strings.emailAlreadyExist);
      return true;
    } else if (isUser.data.byPhone) {
      toast.warning(strings.phoneAlreadyExist);
      return true;
    } else return false;
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    const { inputs } = state;
    inputs[name] = value;
    setState({
      ...state,
      inputs,
    });
    if (
      validator.isEmpty(
        state.inputs.firstName &&
          state.inputs.lastName &&
          phoneNumber &&
          state.inputs.password &&
          state.inputs.confirmPassword &&
          state.inputs.firstName
      )
    ) {
      setClickable(true);
    } else {
      if (state.inputs.isPoliceRead) {
        setClickable(false);
      } else {
        setClickable(true);
      }
    }
  };

  const handleCheckboxChange = (e: any) => {
    const value = e.target.checked;
    const { name } = e.target;
    const { inputs } = state;

    inputs[name] = value;
    setState({
      ...state,
      inputs,
    });
    if (
      validator.isEmpty(
        state.inputs.firstName &&
          state.inputs.lastName &&
          phoneNumber &&
          state.inputs.password &&
          state.inputs.confirmPassword &&
          state.inputs.firstName
      )
    ) {
      setClickable(true);
    } else {
      if (state.inputs.isPoliceRead) {
        setClickable(false);
      } else {
        setClickable(true);
      }
    }
  };

  // fetch mfi data
  const handleMfi = async (mfiName) => {
    const response: any = await getMFIData(mfiName);
    if (response) {
      setEnterAPI(true);
    } else {
      setEnterAPI(true);
    }
  };

  useEffect(() => {
    if (mfi) {
      handleMfi(mfi);
    } else {
      setEnterAPI(true);
    }
  }, [href]);

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
                <Col md={6} sm={12} className='text-left'>
                  <Form.Group>
                    <Form.Control
                      type='text'
                      placeholder={strings.firstName}
                      name='firstName'
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      value={state.inputs.firstName}
                    />
                    {showErrors === true &&
                      validator.isEmpty(state.inputs.firstName) && (
                        <div className='app-error-msg'>{strings.required}</div>
                      )}
                  </Form.Group>
                </Col>
                <Col md={6} sm={12} className='text-left'>
                  <Form.Group>
                    <Form.Control
                      type='text'
                      placeholder={strings.lastName}
                      name='lastName'
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      value={state.inputs.lastName}
                    />
                    {showErrors === true &&
                      validator.isEmpty(state.inputs.lastName) && (
                        <div className='app-error-msg'>{strings.required}</div>
                      )}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className='text-left'>
                  <Form.Group>
                    <PhoneInput
                      country={"us"}
                      value={phoneNumber}
                      onChange={(phone) => setPhoneNumber(phone)}
                      inputProps={{
                        name: "phoneNumber",
                        required: true,
                      }}
                      inputClass='form-control w-100'
                    />
                    {showErrors === true && validator.isEmpty(phoneNumber) && (
                      <div className='app-error-msg'>{strings.required}</div>
                    )}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className='text-left'>
                  <Form.Group>
                    <Form.Control
                      type='email'
                      placeholder={strings.email}
                      name='email'
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      value={state.inputs.email}
                    />
                    {showErrors === true &&
                      validator.isEmpty(state.inputs.email) && (
                        <div className='app-error-msg'>{strings.required}</div>
                      )}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className='text-left'>
                  <Form.Group>
                    <Form.Control
                      type='password'
                      placeholder={strings.password}
                      name='password'
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      value={state.inputs.password}
                    />
                    {showErrors === true &&
                    validator.isEmpty(state.inputs.password) ? (
                      <div className='app-error-msg'>{strings.required}</div>
                    ) : (
                      showErrors === true &&
                      state.inputs.password.length < 8 && (
                        <div className='app-error-msg'>
                          {strings.passwordLengthErrorMsg}
                        </div>
                      )
                    )}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className='text-left'>
                  <Form.Group>
                    <Form.Control
                      type='password'
                      placeholder={strings.confirmPassword}
                      name='confirmPassword'
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      value={state.inputs.confirmPassword}
                    />
                    {showErrors === true &&
                      validator.isEmpty(state.inputs.confirmPassword) && (
                        <div className='app-error-msg'>{strings.required}</div>
                      )}
                    {showErrors === true &&
                      !validator.isEmpty(state.inputs.confirmPassword) &&
                      !validator.equals(
                        state.inputs.password,
                        state.inputs.confirmPassword
                      ) && (
                        <div className='app-error-msg'>
                          {strings.ConfirmPasswordNotMatchedPassword}
                        </div>
                      )}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className='text-left'>
                  <Form.Group>
                    <Form.Control
                      type='text'
                      as='textarea'
                      placeholder={strings.myBio}
                      name='bio'
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      value={state.inputs.bio}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className='text-left'>
                  <Form.Group>
                    <Form.Check
                      type='checkbox'
                      label='I have read and agree to the Terms of Service and Privacy Policy.'
                      checked={state.inputs.isPoliceRead}
                      onChange={handleCheckboxChange}
                      name='isPoliceRead'
                    />
                    {showErrors === true &&
                      state.inputs.isPoliceRead === false && (
                        <div className='app-error-msg'>{strings.required}</div>
                      )}
                  </Form.Group>
                </Col>
              </Row>
              <button
                type='button'
                className='app-primary-btn'
                onClick={handleClick}
                disabled={isClickable}
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
                  strings.createProfile
                )}
              </button>
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

export default Register;
