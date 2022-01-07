import React, { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

import { getMFIData } from "API/api";
import strings from "localization";

import Card from "components/Layout/layout";
import Menu from "components/Layout/menu";
import Footer from "components/Layout/footer";

import loader from "Assets/Images/loader.gif";

function Start() {
  let { mfi }: any = useParams();
  const href = window.location.href;

  const [enterAPI, setEnterAPI] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [slogan, setSlogan] = useState("");
  const [welcomeMsg, setWelcomeMsg] = useState("");

  useEffect(() => {
    const language: any = localStorage.getItem("language");
    if (language) {
      strings.setLanguage(language);
      setSelectedLanguage(language);
    } else {
      localStorage.setItem("language", "en");
    }
    handleMfi(mfi);
  }, [href]);

  // fetch mfi data
  const handleMfi = async (mfiName) => {
    const response: any = await getMFIData(mfiName);
    if (response) {
      setSlogan(response.slogan);
      setWelcomeMsg(response.welcomeMessage);
      setEnterAPI(true);
    } else {
      setEnterAPI(true);
    }
  };

  const handleSelectLanguage = (e) => {
    localStorage.removeItem("language");
    localStorage.setItem("language", e.target.value);
    setSelectedLanguage(e.target.value);
    window.location.reload();
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
            <div className='app-page-title d-flex align-self-center'>
              {enterAPI && (
                <h1>{welcomeMsg ? welcomeMsg : "COMMUNITY LENDING"}</h1>
              )}
            </div>
            {enterAPI && (
              <p className='my-4'>
                {slogan ? slogan : "Get a 0% Interest Loan Today"}
              </p>
            )}
            <div className='my-4'>
              <Link to='/App/Register' className='app-primary-btn'>
                {strings.getStart}
              </Link>
            </div>
            <div>
              <Link to={`/App/Login/${mfi ? mfi : ""}`} className='app-link'>
                {strings.login}
              </Link>
            </div>
            <p className='mt-2'>
              <select
                value={selectedLanguage}
                onChange={(e) => handleSelectLanguage(e)}
                className='form-control app-language-control'
              >
                <option value='en'>English</option>
                <option value='be'>Bengali</option>
                <option value='ar'>Arabic</option>
              </select>
            </p>
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

export default Start;
