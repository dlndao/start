import React, { Fragment, useEffect, useState } from "react";
import { Row, Col, Tabs, Tab } from "react-bootstrap";

import { getLoanInfo, getProposalsByUserAddress } from "API/api";
import strings from "localization";

import Footer from "components/Layout/footer";
import Loader from "components/Layout/loader";
import Borrow from "./borrow";
import Invest from "./invest";
import Repaid from "./repaid";
import Ignored from "./ignored";
/**
 * rendering the Home  page 
 * @returns UI element
 */
function Home() {
  const [investText, setInvestText] = useState("");
  const [borrowText, setBorrowText] = useState("");
  const [repaidText, setRepaidText] = useState("");
  const [ignoredText, setIgnoredText] = useState("");
  const [selectedKey, setSelectedKey] = useState("borrow");
  const [loadProposals, setLoadProposals] = useState(false);
  const [proposals, setProposals]: any = useState([]);
  const [loanData, setLoanData]: any = useState({});
  const [callSpinnerFlag, setCallSpinnerFlag] = useState(false);

  const href = window.location.href;

  useEffect(() => {
    (async () => {
      const language: any = localStorage.getItem("language");
      if (language) {
        strings.setLanguage(language);
        setInvestText(strings.invest);
        setBorrowText(strings.borrow);
        setRepaidText(strings.repaid);
        setIgnoredText(strings.ignored);
      }
      getProposals();
    })();
  }, [href]);

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

  const handleSelectTab = (key, e) => {
    setSelectedKey(key);
    removeClass();
  };

  const getProposals = async () => {
    let _user: any = {};
    setLoadProposals(true);
    let data = localStorage.getItem("userData");
    if (data) {
      // setUserData(JSON.parse(data));
      _user = JSON.parse(data);
    }
    if(!data)return
    // get loan total record from db
    const response: any = await getLoanInfo(_user.id);
    if (response) {
      if (response.success) {
        setLoanData({
          totalFunded: response.data.funded.amount,
          totalRepaid: response.data.paid,
        });
      } else {
      }
    }
    const _proposals: any = await getProposalsByUserAddress(_user.id, _user.id);
    setProposals(_proposals.data);
    setLoadProposals(false);
  };

  //refetch data after updating proposal
  const handleCallSpinner = async () => {
    await getProposals();
    setCallSpinnerFlag(!callSpinnerFlag);
  };

  return (
    <Fragment>
      {loadProposals ? (
        <Row className='mt-5 min-height-100 justify-content-center'>
          <Col xl={7} lg={7} md={7} sm={12}>
            <Loader />
          </Col>
        </Row>
      ) : (
        <>
          <Row className='justify-content-center app-nav-containers'>
            <Col xl={7} lg={7} md={7} sm={12}>
              <Tabs
                defaultActiveKey='borrow'
                transition={false}
                id='noanim-tab-example'
                className='app-nav-tabs d-flex justify-content-around'
                onSelect={(key, e) => handleSelectTab(key, e)}
              >
                <Tab eventKey='borrow' title={borrowText}>
                  {selectedKey === "borrow" && (
                    <Borrow
                      handleCallSpinner={handleCallSpinner}
                      borrowProposals={proposals.filter(
                        (item) => item.status !== 6
                      )}
                      loanData={loanData}
                    />
                  )}
                </Tab>

                <Tab eventKey='repaid' title={repaidText}>
                  {selectedKey === "repaid" && (
                    <Repaid
                      handleCallSpinner={handleCallSpinner}
                      repaidProposals={proposals.filter(
                        (item) => item.status === 6
                      )}
                      loanData={loanData}
                    />
                  )}
                </Tab>
                <Tab eventKey='invest' title={investText}>
                  {selectedKey === "invest" && <Invest />}
                </Tab>
                <Tab eventKey='ignored' title={ignoredText}>
                  {selectedKey === "ignored" && <Ignored loanData={loanData} />}
                </Tab>
              </Tabs>
            </Col>
          </Row>
          <Row className='justify-content-center'>
            <Col xl={7} lg={7} md={7} sm={12}>
              <Footer />
            </Col>
          </Row>
        </>
      )}
    </Fragment>
  );
}
export default Home;
