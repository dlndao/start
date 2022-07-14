import React, { Fragment, useState, useEffect } from "react";
import { Row, Col, Form, Spinner } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { Avatar } from "@material-ui/core";
import { toast } from "react-toastify";
import validator from "validator";
import { Storage, API } from "aws-amplify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltLeft } from "@fortawesome/free-solid-svg-icons";

import strings from "localization";

import Footer from "components/Layout/footer";
import Card from "components/Layout/layout";

import loader from "Assets/Images/loader.gif";
import saveIcon from "Assets/Images/icons/save.png";
import cancelIcon from "Assets/Images/icons/cancel.png";

Storage.configure({
  bucket: "dlnresources182402-dev",
  level: "public",
});
/**
 * fetch and manage user profile
 * @returns UI element
 */
function Profile() {
  const history: any = useHistory();
  const fileInput: any = React.useRef<HTMLInputElement>();
  const href = window.location.href;

  const handleClick = async (e) => {
    setShowErrors(true);
    let key: any;

    if (
      state.inputs.firstName !== "" &&
      state.inputs.lastName !== "" &&
      state.inputs.email !== "" &&
      state.inputs.phoneNumber !== "" &&
      state.inputs.bio !== ""
    ) {
      setSaveClicked(true);
      if (uploadImage) {
        key = await saveImage(fileName, fileData, fileType);
      } else {
        key = state.inputs.profileImg;
      }
      const { firstName, lastName, phoneNumber, email, bio } = state.inputs;
      await API.put("auth", `/api/users/${state.inputs.id}`, {
        headers: { "Content-Type": "application/json" },
        body: {
          firstName: firstName,
          lastName: lastName,
          phone: phoneNumber,
          email: email,
          bio: bio,
          profileImage: key,
        },
      }).then(async () => {
        setShowErrors(false);
        setSaveClicked(false);
        let data: any = localStorage.getItem("userData");
        let userData: any = {};
        if (data) {
          userData = JSON.parse(data);
        }
        const _userData = await API.get("auth", "/api/auth/", {
          headers: { "Content-Type": "application/json" },
          queryStringParameters: { username: userData.username },
        });
        if (_userData) {
          localStorage.removeItem("userData");
          localStorage.setItem("userData", JSON.stringify(_userData.data));
        }
        window.location.reload();
        toast.success("Data Saved Successfully");
        setUploadImage(false);
        // history.push("/App/Home");
      });
    }
  };

  const initialInputs = () => ({
    inputs: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      bio: "",
      id: "",
      profileImg: "",
    },
  });

  const [state, setState] = useState(initialInputs());
  const [profileImg, setProfileImg]: any = useState();
  const [saveClicked, setSaveClicked] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [uploadImage, setUploadImage] = useState(false);
  const [loadData, setLoadData] = useState(true);
  const [fileName, setFileName] = useState("");
  const [fileData, setFileData] = useState();
  const [fileType, setFileType] = useState();

  const handleChange = (e) => {
    const { value, name } = e.target;
    const { inputs } = state;

    inputs[name] = value;
    setState({
      ...state,
      inputs,
    });
  };

  const upload = async (e) => {
    setUploadImage(true);
    setProfileImg(URL.createObjectURL(e.target.files[0]));
    let file = fileInput.current.files[0];
    let reader = new FileReader();
    reader.readAsArrayBuffer(file);
    setFileType(e.target.files[0].type);
    setFileName(state.inputs.id + "_" + e.target.files[0].name);
    reader.onload = async (event: any) => {
      setFileData(event.target.result);
    };
  };

  const saveImage = async (name, data, type) => {
    let fileKey;
    await Storage.put("profileImages/" + name, data, {
      contentType: type,
      level: "public",
    }).then((result) => {
      fileKey = result; //result.key;
    });
    return fileKey.key;
  };

  const handleCancel = () => {
    const location = "/App/Home";
    history.push(location);
  };

  const handleSelectLanguage = (e) => {
    localStorage.removeItem("language");
    localStorage.setItem("language", e.target.value);
    setSelectedLanguage(e.target.value);
  };

  useEffect(() => {
    (async () => {
      const language: any = localStorage.getItem("language");
      let data: any = localStorage.getItem("userData");
      if (data) {
        const userData = JSON.parse(data);
        setState({
          ...state,
          inputs: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            phoneNumber: userData.phone,
            email: userData.email,
            bio: userData.bio,
            id: userData.id,
            profileImg: userData.profileImage,
          },
        });
        const imgURl = await Storage.get(userData.profileImage);
        setProfileImg(imgURl);
        setLoadData(false);
      }
      if (language) {
        strings.setLanguage(language);
        setSelectedLanguage(language);
      } else {
        localStorage.setItem("language", "en");
      }
    })();
  }, [href]);

  return (
    <Fragment>
      {loadData ? (
        <Row className='align-items-center h-100-vh'>
          <Col>
            <img src={loader} className='loader-img' width='200' />
          </Col>
        </Row>
      ) : (
        <Fragment>
          <Row className='justify-content-center mx-4'>
            <Col xl={7} lg={7} md={7} sm={12}>
              <div
                className='app-back-link app-link'
                onClick={(e) => handleCancel()}
              >
                <FontAwesomeIcon icon={faLongArrowAltLeft} />{" "}
                <span>{strings.backToHome}</span>
              </div>
            </Col>
          </Row>
          <Card pageClassName='app-profile-page'>
            <Form className='app-form'>
              <Row>
                <Col md={12} sm={12}>
                  <label
                    htmlFor='contained-button-file'
                    className='cursor-pointer'
                  >
                    <Avatar
                      alt=''
                      src={profileImg}
                      className='app-user-profile-img cursor-pointer'
                    />
                  </label>
                  <input
                    accept='*/*'
                    className='d-none'
                    id='contained-button-file'
                    type='file'
                    ref={fileInput}
                    onChange={(e) => upload(e)}
                  />
                </Col>
              </Row>
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
                <Col md={6} sm={12} className='text-left'>
                  <Form.Group>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => handleSelectLanguage(e)}
                      className='form-control'
                    >
                      <option value='en'>English</option>
                      <option value='be'>Bengali</option>
                      <option value='ar'>Arabic</option>
                    </select>
                  </Form.Group>
                </Col>
                <Col md={6} sm={12} className='text-left'>
                  <Form.Group>
                    <Form.Control
                      type='text'
                      placeholder={strings.phone}
                      name='phoneNumber'
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      value={state.inputs.phoneNumber}
                    />
                    {showErrors === true &&
                      validator.isEmpty(state.inputs.phoneNumber) && (
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
                      type='text'
                      as='textarea'
                      placeholder={strings.myBio}
                      name='bio'
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      value={state.inputs.bio}
                    />
                    {showErrors === true &&
                      validator.isEmpty(state.inputs.bio) && (
                        <div className='app-error-msg'>{strings.required}</div>
                      )}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  {saveClicked ? (
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
                      onClick={(e) => handleClick(e)}
                    />
                  )}
                </Col>
                <Col>
                  <img
                    className='app-action-icon'
                    src={cancelIcon}
                    alt='icon'
                    onClick={(e) => handleCancel()}
                  />
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

export default Profile;
