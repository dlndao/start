import React, { useState, useEffect } from "react";
import { Modal, ModalBody } from "react-bootstrap";
import AvatarImg from "Assets/Images/icons/Avatar.png";
import { Row, Col } from "react-bootstrap";
import { Avatar } from "@material-ui/core";
import { API, Storage } from "aws-amplify";
import classNames from "classnames";

import { useUserState } from "contexts/UserAuthContext";
import strings from "localization";

import loader from "Assets/Images/loader.gif";
import {
  lockActiveIcon,
  repayActiveIcon,
  bakedActiveIcon,
  fundedActiveIcon,
  publishActiveIcon,
  fundedIcon,
  lockIcon,
  bakedIcon,
  allIcon,
  repayIcon,
  publishIcon,
} from "Assets/Images/index";
/**
 * single chat screen
 */
function SingleChat({ proposalTitle, proposalId, InviteModalClosed, isAll }:{
  proposalTitle:string, proposalId?:any, InviteModalClosed:Function, isAll?:boolean
}) {
  let userData: any = {};

  const [showInviteModal, setShowInviteModal]: any = useState(true);
  const [AllProposals, setProposals]: any = useState([{ title: "", id: 0 }]);
  const [isLoadProposals, setLoadProposals] = useState(false);
  const [isActive, setActive] = useState("");
  const { user }: any = useUserState();
  const [clickedFilter, setClickedFilter] = useState(false);
  const [filteredProposals, setFilteredProposals] = useState([
    { title: "", id: 0 },
  ]);
  const [isArabic, setIsArabic] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(0);
  const [userInfo, setUserInfo]: any = useState();
  const [stateArr, setState]: any = useState();
  const [newMsg, setNewMsg] = useState("");

  //close modal, call parent functionality on close
  const handleCloseModal = () => {
    setShowInviteModal(false);
    InviteModalClosed();
  };

  const getMessages = async (proposalId, userId) => {
    setLoadProposals(true);
    const message = await API.get("auth", "/api/messages/", {
      headers: { "Content-Type": "application/json" },
      queryStringParameters: { proposalId: proposalId, userId: userId },
    });
    if (message) {
      message.data.map((item) => {
        var str = item.date;
        item.date = str.slice(0, 10);
        item.time = str.slice(11, 16);
      });
    }
    setState(message.data);

    if (message.data) {
      const lastElement = message.data
        ? message.data[message.data.length - 1]
        : null;
      if (lastElement) {
        setReadMessage(lastElement.id, userId);
      }
    }
    setLoadProposals(false);
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
      } else {
        setIsArabic(false);
      }
      let data = localStorage.getItem("userData");
      if (data) {
        userData = JSON.parse(data);
        setUserInfo(userData);
        if (!isAll) {
          getMessages(proposalId ? proposalId : selectedProposal, userData.id);
        } else {
          //get all unread messages
          getMessages(null, userData.id);
        }
      }

      getProposals();
      if (proposalId) {
        setSelectedProposal(proposalId);
      }
    })();
  }, []);

  const setReadMessage = async (mesID, userId) => {
    await API.post("auth", "/api/messages/read", {
      headers: { "Content-Type": "application/json" },
      body: {
        userId: userId,
        messageId: mesID,
      },
    }).then((response) => {});
  };

  //get current user proposals
  const getProposals = async () => {
    setLoadProposals(true);

    const proposals = await API.get(
      "auth",
      "/api/borrow/proposalsByUserAddress",
      {
        headers: { "Content-Type": "application/json" },
        queryStringParameters: { address: userData.id, userId: userData.id },
      }
    );
    setProposals(proposals.data.filter((prop: any) => prop.status != 1));
    setLoadProposals(false);
  };

  //handle filtering proposal according to status
  const handleFilter = async (filter) => {
    let data;
    setLoadProposals(true);
    setClickedFilter(true);
    if (filter == "published") {
      data = AllProposals.filter((prop: any) => prop.status === 2);
    } else if (filter == "locked") {
      data = AllProposals.filter((prop: any) => prop.status === 3);
    } else if (filter == "backed") {
      data = AllProposals.filter((prop: any) => prop.status === 4);
    } else if (filter == "funded") {
      data = AllProposals.filter((prop: any) => prop.status === 5);
    } else if (filter == "repaid") {
      data = AllProposals.filter((prop: any) => prop.status === 6);
    } else {
      data = AllProposals;
    }
    setFilteredProposals(data);

    setLoadProposals(false);
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setNewMsg(value);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMsg !== "") {
      var imgURl: any;
      if (userInfo.profileImage) {
        imgURl = await Storage.get(userInfo.profileImage);
      }
      await API.post("auth", "/api/messages/", {
        headers: { "Content-Type": "application/json" },
        body: {
          userId: userInfo.id,
          proposalId: selectedProposal,
          text: newMsg,
        },
      }).then((response) => {
        var newOne = {
          userName: "Me",
          date: "Now",
          time: "",
          text: newMsg,
          userId: 1,
          image: userInfo.id,
          propTitle: proposalTitle,
          user: {
            firstName: "ME",
            lastName: "",
            profileImage: imgURl ? imgURl : AvatarImg,
          },
        };
        setState([...stateArr, newOne]);
        setNewMsg("");
      });
    } else {
      return;
    }
  };

  const handleClickFilter = (flag) => {
    if (flag === "") {
      setClickedFilter(false);
    }
    setActive(flag);
    handleFilter(flag);
  };

  //get messages of choose proposal
  const handleSelectedProposal = (e) => {
    getMessages(e.target.value, userInfo.id);
    setSelectedProposal(e.target.value);
    setReadMessage(e.target.value, userInfo.id);
  };

  return (
    <Modal
      show={showInviteModal}
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
        <Modal.Title>
          {!isAll && <div className='app-text-blue'>{proposalTitle}</div>}

          {isAll && !isLoadProposals && (
            <Row>
              <Col>
                <select
                  className='form-control'
                  value={selectedProposal}
                  onChange={(e) => handleSelectedProposal(e)}
                >
                  <option value={0}>Unread Messages</option>
                  {!clickedFilter
                    ? AllProposals.map((item, index) => (
                        <option value={item.id} key={index}>
                          {item.title}
                        </option>
                      ))
                    : filteredProposals.map((item, index) => (
                        <option value={item.id} key={index}>
                          {item.title}
                        </option>
                      ))}
                </select>
              </Col>
              <Col lg={6} md={6} sm={12} xs={12}>
                <Row>
                  <Col lg={2} md={4} sm={4} xs={4}>
                    <img
                      className='app-action-icon'
                      src={allIcon}
                      alt='icon'
                      onClick={(e) => handleClickFilter("")}
                    />
                  </Col>
                  <Col lg={2} md={4} sm={4} xs={4}>
                    <img
                      className='app-action-icon'
                      src={
                        isActive == "published"
                          ? publishActiveIcon
                          : publishIcon
                      }
                      alt='icon'
                      onClick={(e) => handleClickFilter("published")}
                    />
                  </Col>
                  <Col lg={2} md={4} sm={4} xs={4}>
                    <img
                      className='app-action-icon'
                      src={isActive == "locked" ? lockActiveIcon : lockIcon}
                      alt='icon'
                      onClick={(e) => handleClickFilter("locked")}
                    />
                  </Col>
                  <Col lg={2} md={4} sm={4} xs={4}>
                    <img
                      className='app-action-icon'
                      src={isActive == "backed" ? bakedActiveIcon : bakedIcon}
                      alt='icon'
                      onClick={(e) => handleClickFilter("backed")}
                    />
                  </Col>
                  <Col lg={2} md={4} sm={4} xs={4}>
                    <img
                      className='app-action-icon'
                      src={isActive == "funded" ? fundedActiveIcon : fundedIcon}
                      alt='icon'
                      onClick={(e) => handleClickFilter("funded")}
                    />
                  </Col>

                  <Col lg={2} md={4} sm={4} xs={4}>
                    <img
                      className='app-action-icon'
                      src={isActive == "repaid" ? repayActiveIcon : repayIcon}
                      alt='icon'
                      onClick={(e) => handleClickFilter("repaid")}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          )}
        </Modal.Title>
      </Modal.Header>
      <ModalBody>
        {isLoadProposals ? (
          <Row className='align-items-center'>
            <Col className='text-center'>
              <img src={loader} className='loader-img' width='200' />
            </Col>
          </Row>
        ) : (
          <section className='dln-msger'>
            <main className='dln-msger-chat'>
              {stateArr
                ? stateArr.map((item, index) =>
                    item.userId == userInfo.id || item.userId == 1 ? (
                      <div key={index} className='dln-msg dln-left-msg'>
                        <Avatar
                          className='dln-msg-img'
                          src={
                            item.user.profileImage
                              ? item.user.profileImage
                              : AvatarImg
                          }
                          alt='icon'
                        />
                        <div className='dln-msg-bubble'>
                          <div className='dln-msg-info'>
                            <div className='dln-msg-info-name pr-5'>Me</div>

                            <div className='dln-msg-info-time '>
                              {selectedProposal == 0
                                ? item.propTitle
                                : `${item.date}`}
                            </div>
                            <div className='pl-3'>
                              {" "}
                              {item.time ? item.time : ""}
                            </div>
                          </div>
                          <div className='dln-msg-text'>{item.text}</div>
                        </div>
                      </div>
                    ) : (
                      <div key={index} className='dln-msg dln-right-msg'>
                        <Avatar
                          className='dln-msg-img'
                          src={
                            item.user.profileImage
                              ? item.user.profileImage
                              : AvatarImg
                          }
                          alt='icon'
                        />
                        <div className='dln-msg-bubble'>
                          {selectedProposal == 0 ? (
                            <div className='dln-msg-info-name'>
                              {item.borrow.title}
                            </div>
                          ) : null}
                          <div className='dln-msg-info'>
                            <div className='dln-msg-info-name'>
                              {item.user.firstName}
                            </div>
                            <div className='dln-msg-info-time '>
                              {selectedProposal == 0
                                ? item.propTitle
                                : `${item.date}`}
                            </div>
                            <div className='pl-3'>
                              {" "}
                              {item.time ? item.time : ""}
                            </div>
                          </div>
                          <div className='dln-msg-text'>{item.text}</div>
                        </div>
                      </div>
                    )
                  )
                : null}
            </main>
          </section>
        )}
      </ModalBody>

      <form className='dln-msger-inputarea'>
        <input
          type='text'
          className='dln-msger-input'
          placeholder='Enter your message...'
          value={newMsg}
          onChange={(e) => handleChange(e)}
        />
        <button
          type='submit'
          className='dln-msger-send-btn'
          onClick={(e) => sendMessage(e)}
        >
          {strings.send}
        </button>
      </form>
    </Modal>
  );
}

export default SingleChat;
