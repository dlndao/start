import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import ArrowForward from "@material-ui/icons/ArrowForward";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import { Link } from "react-router-dom";
import { toast as assetToast } from "react-toastify";

import { useUserState } from "contexts/UserAuthContext";
import { ERC20Client } from "services/erc20-client";

import { logoDark, CasperLabs, Casper2 } from "../../Assets/Images";

const getInitialState = () => ({
  loading: false,
  tokensList: [],
  testAssets: [],
  DLNAssetsBalances: [],
  selectedTokenSymbol: "",
  selectedMintTokenSymbol: "",
  requestBtnClicked: false,
  mintBtnClicked: false,
  redeemBtnClicked: false,
  stakeBtnClicked: false,
  unStakeBtnClicked: false,
  backBtnClicked: false,
  unbackBtnClicked: false,
  delegateBackingBtnClicked: false,
  delegateUnBackingBtnClicked: false,
  transactionLog: [],
  proposalsLoading: true,
  proposals: [],
  isViewShowing: false,
  editId: "",
  inputs: {
    mintedAddress: "",
    mintedAmount: "",
    requestTokenAddress: "",
    mintTokenAddress: "",
    redeemTokenAddress: "",
    stakeTokenAddress: "",
    unStakeTokenAddress: "",
    backTokenAddress: "",
    unbackTokenAddress: "",
    amount: "",
    requestTokenValue: 0,
    mintTokenValue: 0,
    redeemTokenValue: 0,
    stakeTokenValue: 0,
    unStakeTokenValue: 0,
    backTokenValue: 0,
    unbackTokenValue: 0,
  },
  balances: {
    tUSDC: 0,
    tUSDT: 0,
    aUSDC: 0,
    aUSDT: 0,
    DLN: 0,
    DLNG: 0,
  },
});

function CasperAssets() {
  const eRC20Client = new ERC20Client();
  const [refreshLoading, setRefreshLoading] = useState(true);
  const { user }: any = useUserState();

  const [state, setState]: any = useState(getInitialState());

  assetToast.configure({
    position: "top-center",
    autoClose: 100000,
    draggable: false,
  });

  useEffect(() => {
    (async () => {
      await getBalance().then(() => {
        setRefreshLoading(false);
      });
    })();
  }, []);

  const getBalance = async () => {
    const balanceOf = await eRC20Client.balanceOf(
      user.publicAddress,
      "ERC20_DLNG_STAKE_contract_hash"
    );

    const tUSDC = await eRC20Client.getTokenBalance(
      user.publicAddress,
      "ERC20_tUSDC"
    );

    const aUSDC = await eRC20Client.getTokenBalance(
      user.publicAddress,
      "ERC20_aUSDC_contract_hash"
    );

    const tUSDT = await eRC20Client.getTokenBalance(
      user.publicAddress,
      "ERC20_tUSDT"
    );

    const aUSDT = await eRC20Client.getTokenBalance(
      user.publicAddress,
      "ERC20_aUSDT_contract_hash"
    );

    const DLN = await eRC20Client.getTokenBalance(
      user.publicAddress,
      "ERC20_DLN"
    );

    const DLNG = await eRC20Client.getTokenBalance(
      user.publicAddress,
      "ERC20_DLNG"
    );

    const proposals = await proposalsAmount();

    // const addProposal = await eRC20Client.addProposal(
    //   'ERC20_aUSDT_contract_hash',
    //   'ERC20_aUSDC_contract_hash',
    //   'address-,userId-413,mfiId-1,description-Regular power cut is a common issue in Sundarban deltaic region. Due to this the entire family members are facing problems in studying of children cooking and a regular jobs.To address these all problems. the proposed beneficiary is requested to take l,amount-200,currentBalance-0,term- ,title-Goutam Sepai,monthsToRepay-12',
    //   '169'
    // );

    setState({
      ...state,
      proposals,
      balances: { tUSDC, aUSDC, tUSDT, aUSDT, DLN, DLNG },
    });
  };

  const handleRefresh = async () => {
    setRefreshLoading(true);
    await getBalance().then(() => {
      setRefreshLoading(false);
    });
  };

  const proposalsAmount = async () => {
    // const proposals = await API.get('auth', '/api/borrow', {});
    const mappedProposals: any = [];
    const proposalIds = ["80", "144", "166", "168", "169"];

    for (const proposalId in proposalIds) {
      const getProposal: any = await eRC20Client.getProposal(
        "ERC20_DLN_PROPOSAL_contract_hash",
        proposalIds[proposalId]
      );
      getProposal["id"] = proposalIds[proposalId];
      mappedProposals.push(getProposal);
    }

    // let proposalFunds = proposals.data.filter(
    //   (proposal) => proposal.status === 2 && proposal.status !== 5
    // );
    return mappedProposals;
  };

  const handleChange = (e: any) => {
    const { value, name } = e.target;
    const { inputs }: any = state;

    inputs[name] = value;

    setState({
      ...state,
      inputs,
    });
  };

  let toastRequestClicked: any = React.useRef(null);

  const handleRequest = async () => {
    const { inputs }: any = state;

    setState({ ...state, requestBtnClicked: true });
    toastRequestClicked.current = assetToast.success(
      "Transaction sent to network, please wait...",
      {
        autoClose: 60000,
      }
    );
    const faustHash = await eRC20Client.transfer(
      `ERC20_${inputs.requestTokenAddress}`,
      "01700bd2dc609faf7bbfb92dc8cb2a1e3f9fd2c5685f6fa94176fb9c175cd15203",
      user.publicAddress,
      inputs.requestTokenValue,
      false
    );
    assetToast.dismiss(toastRequestClicked.current);
    assetToast.success(
      <div>
        Request {state.inputs.requestTokenValue}{" "}
        {state.inputs.requestTokenAddress}
        <br /> URL:
        <a
          href={`https://testnet.cspr.live/deploy/${faustHash}`}
          className='ml-1 text-white dln-text-underline'
          target='_blank'
        >
          Txn Hash
        </a>
      </div>
    );
    handleRefresh();
    inputs["requestTokenValue"] = 0;
    setState({
      ...state,
      inputs,
      requestBtnClicked: false,
    });
  };

  let toastMintClicked: any = React.useRef(null);

  const handleMint = async () => {
    const { inputs }: any = state;
    setState({ ...state, mintBtnClicked: true });
    toastMintClicked.current = assetToast.success(
      "Transaction sent to network, please wait...",
      {
        autoClose: 60000,
      }
    );
    const tokenReflection =
      inputs.mintTokenAddress === "tUSDT" ? "aUSDT" : "aUSDC";

    const transferFromUserWallet = await eRC20Client.transfer(
      `ERC20_${inputs.mintTokenAddress}`,
      user.publicAddress,
      "01700bd2dc609faf7bbfb92dc8cb2a1e3f9fd2c5685f6fa94176fb9c175cd15203",
      inputs.mintTokenValue,
      true
    );

    if (transferFromUserWallet) {
      const transferToUserWallet = await eRC20Client.transfer(
        `ERC20_${tokenReflection}_contract_hash`,
        "01700bd2dc609faf7bbfb92dc8cb2a1e3f9fd2c5685f6fa94176fb9c175cd15203",
        user.publicAddress,
        inputs.mintTokenValue,
        false
      );
    }
    assetToast.dismiss(toastMintClicked.current);
    assetToast.success(
      <div>
        Mint {state.inputs.mintTokenValue} {state.inputs.mintTokenAddress}
        <br /> URL:
        <a
          href={`https://testnet.cspr.live/deploy/${transferFromUserWallet}`}
          className='ml-1 text-white dln-text-underline'
          target='_blank'
        >
          Txn Hash
        </a>
      </div>
    );
    handleRefresh();
    inputs["mintTokenValue"] = 0;
    setState({
      ...state,
      inputs,
      mintBtnClicked: false,
    });
  };

  let toastRedeemClicked: any = React.useRef(null);

  const handleRedeem = async () => {
    const { inputs }: any = state;
    setState({ ...state, redeemBtnClicked: true });
    toastRedeemClicked.current = assetToast.success(
      "Transaction sent to network, please wait...",
      {
        autoClose: 60000,
      }
    );
    const tokenReflection =
      inputs.redeemTokenAddress === "aUSDT" ? "tUSDT" : "tUSDC";

    const transferFromUserWallet = await eRC20Client.transfer(
      `ERC20_${inputs.redeemTokenAddress}_contract_hash`,
      user.publicAddress,
      "01700bd2dc609faf7bbfb92dc8cb2a1e3f9fd2c5685f6fa94176fb9c175cd15203",
      inputs.redeemTokenValue,
      true
    );

    if (transferFromUserWallet) {
      const transferToUserWallet = await eRC20Client.transfer(
        `ERC20_${tokenReflection}`,
        "01700bd2dc609faf7bbfb92dc8cb2a1e3f9fd2c5685f6fa94176fb9c175cd15203",
        user.publicAddress,
        inputs.redeemTokenValue,
        false
      );
    }
    assetToast.dismiss(toastRedeemClicked.current);
    assetToast.success(
      <div>
        Redeem {state.inputs.redeemTokenValue} {state.inputs.redeemTokenAddress}
        <br /> URL:
        <a
          href={`https://testnet.cspr.live/deploy/${transferFromUserWallet}`}
          className='ml-1 text-white dln-text-underline'
          target='_blank'
        >
          Txn Hash
        </a>
      </div>
    );
    handleRefresh();
    inputs["redeemTokenValue"] = 0;
    setState({
      ...state,
      inputs,
      redeemBtnClicked: false,
    });
  };

  let toastStakeClicked: any = React.useRef(null);

  const handleStake = async (e) => {
    e.preventDefault();
    setState({ ...state, stakeBtnClicked: true });
    toastStakeClicked.current = assetToast.success(
      "Transaction sent to network, please wait...",
      {
        autoClose: 60000,
      }
    );
    const { inputs }: any = state;

    const transferFromUserWallet = await eRC20Client.transfer(
      `ERC20_${inputs.stakeTokenAddress}_contract_hash`,
      user.publicAddress,
      "01700bd2dc609faf7bbfb92dc8cb2a1e3f9fd2c5685f6fa94176fb9c175cd15203",
      inputs.stakeTokenValue,
      true
    );
    assetToast.dismiss(toastStakeClicked.current);

    assetToast.success(
      <div>
        Stake {state.inputs.stakeTokenValue} {state.inputs.stakeTokenAddress}
        <br /> URL:
        <a
          href={`https://testnet.cspr.live/deploy/${transferFromUserWallet}`}
          className='ml-1 text-white dln-text-underline'
          target='_blank'
        >
          Txn Hash
        </a>
      </div>
    );
    handleRefresh();
    inputs["stakeTokenValue"] = 0;
    setState({
      ...state,
      inputs,
      stakeBtnClicked: false,
    });
  };

  let toastUnStakeClicked: any = React.useRef(null);

  const handleUnStake = async (e) => {
    e.preventDefault();
    setState({ ...state, unStakeBtnClicked: true });
    toastUnStakeClicked.current = assetToast.success(
      "Transaction sent to network, please wait...",
      {
        autoClose: 60000,
      }
    );
    const { inputs }: any = state;

    const transferToUserWallet = await eRC20Client.transfer(
      `ERC20_${inputs.unStakeTokenAddress}_contract_hash`,
      "01700bd2dc609faf7bbfb92dc8cb2a1e3f9fd2c5685f6fa94176fb9c175cd15203",
      user.publicAddress,
      inputs.unStakeTokenValue,
      true
    );

    const rewardDLNAmount = ((inputs.unStakeTokenValue * 10) / 100).toString();

    const transferRewards = await eRC20Client.transfer(
      `ERC20_DLN`,
      "01700bd2dc609faf7bbfb92dc8cb2a1e3f9fd2c5685f6fa94176fb9c175cd15203",
      user.publicAddress,
      rewardDLNAmount,
      false
    );

    assetToast.dismiss(toastUnStakeClicked.current);

    assetToast.success(
      <div>
        UnStake {state.inputs.unStakeTokenValue}{" "}
        {state.inputs.unStakeTokenAddress}
        <br /> URL:
        <a
          href={`https://testnet.cspr.live/deploy/${transferToUserWallet}`}
          className='ml-1 text-white dln-text-underline'
          target='_blank'
        >
          Txn Hash
        </a>
      </div>
    );
    handleRefresh();
    inputs["unStakeTokenValue"] = 0;
    setState({
      ...state,
      inputs,
      unStakeBtnClicked: false,
    });
  };

  let toastBackClicked: any = React.useRef(null);

  const handleBacking = async (e) => {
    // erc20_social_staking_contract
    e.preventDefault();
    setState({ ...state, backBtnClicked: true });
    toastBackClicked.current = assetToast.success(
      "Transaction sent to network, please wait...",
      {
        autoClose: 60000,
      }
    );
    const { inputs }: any = state;

    const transferFromUserWallet = await eRC20Client.transfer(
      `ERC20_${inputs.backTokenAddress}_contract_hash`,
      user.publicAddress,
      "01700bd2dc609faf7bbfb92dc8cb2a1e3f9fd2c5685f6fa94176fb9c175cd15203",
      inputs.backTokenValue,
      true
    );

    const backTransaction = await eRC20Client.back(
      `ERC20_${inputs.backTokenAddress}_contract_hash`,
      user.publicAddress,
      inputs.backTokenValue,
      inputs.backProposal.toString()
    );

    assetToast.dismiss(toastBackClicked.current);
    assetToast.success(
      <div>
        Back {state.inputs.backTokenValue} {state.inputs.backTokenAddress}
        <br /> URL:
        <a
          href={`https://testnet.cspr.live/deploy/${transferFromUserWallet}`}
          className='ml-1 text-white dln-text-underline'
          target='_blank'
        >
          Txn Hash
        </a>
      </div>
    );

    inputs["backTokenValue"] = 0;
    handleRefresh();
    setState({
      ...state,
      inputs,
      backBtnClicked: false,
    });
  };

  let toastunBackClicked: any = React.useRef(null);

  const handleUnBacking = async (e) => {
    e.preventDefault();
    setState({ ...state, unbackBtnClicked: true });
    toastunBackClicked.current = assetToast.success(
      "Transaction sent to network, please wait...",
      {
        autoClose: 60000,
      }
    );
    const { inputs }: any = state;

    const unBackTransaction = await eRC20Client.unBack(
      `ERC20_${inputs.unbackTokenAddress}_contract_hash`,
      inputs.unBackProposal
    );
    if (unBackTransaction) {
      const transferToUserWallet = await eRC20Client.transfer(
        `ERC20_${inputs.unbackTokenAddress}_contract_hash`,
        "01700bd2dc609faf7bbfb92dc8cb2a1e3f9fd2c5685f6fa94176fb9c175cd15203",
        user.publicAddress,
        inputs.unbackTokenValue,
        true
      );

      const rewardDLNAmount = (
        (inputs.unbackTokenValue * 1.5) /
        100
      ).toString();
      const rewardDLNGAmount = (
        (inputs.unbackTokenValue * 0.005) /
        100
      ).toString();

      const transferDLNRewards = await eRC20Client.transfer(
        `ERC20_DLN`,
        "01700bd2dc609faf7bbfb92dc8cb2a1e3f9fd2c5685f6fa94176fb9c175cd15203",
        user.publicAddress,
        rewardDLNAmount,
        false
      );

      const transferDLNGRewards = await eRC20Client.transfer(
        `ERC20_DLNG`,
        "01700bd2dc609faf7bbfb92dc8cb2a1e3f9fd2c5685f6fa94176fb9c175cd15203",
        user.publicAddress,
        rewardDLNGAmount,
        false
      );

      assetToast.dismiss(toastunBackClicked.current);
      assetToast.success(
        <div>
          unBack {state.inputs.unbackTokenValue}{" "}
          {state.inputs.unbackTokenAddress}
          <br /> URL:
          <a
            href={`https://testnet.cspr.live/deploy/${transferToUserWallet}`}
            className='ml-1 text-white dln-text-underline'
            target='_blank'
          >
            Txn Hash
          </a>
        </div>
      );
    } else {
      assetToast.dismiss(toastunBackClicked.current);
      assetToast.error("Current address did not back the proposal before.");
    }

    handleRefresh();
    inputs["unbackTokenValue"] = 0;
    setState({
      ...state,
      inputs,
      unbackBtnClicked: false,
    });
  };

  return (
    <>
      {refreshLoading ? (
        <div className='dln-section-spinner-container dln-section-spinner-container__casper'>
          <div className='dln-spinner-body '>
            <Spinner
              className='mr-1 dln-page-spinner'
              as='span'
              animation='border'
              role='status'
              aria-hidden='true'
            />
          </div>
        </div>
      ) : (
        <div className='position-relative dln-casper-assets'>
          <div className='container-fluid dln-contact-form pt-2 pb-4'>
            <div className='row justify-content-center'>
              <div className='col-lg-10 col-md-11 col-sm-12'>
                <img
                  src={CasperLabs}
                  alt=''
                  className='img img-fluid dln-form-logo'
                />
                <img
                  src={Casper2}
                  alt=''
                  className='img img-fluid dln-form-logo dln-form-logo--casper2'
                />
                <Link to='/login'>
                  <img
                    src={logoDark}
                    alt=''
                    className='img img-fluid dln-form-logo'
                  />
                </Link>
              </div>
            </div>
            <div className='row justify-content-center'>
              <div className='col-4'>
                <hr className='dln-inner-page-seperation' />
              </div>
            </div>
            <div className='row justify-content-center mt-4 mx-lg-5 mx-sm-0'>
              <div className='col mb-1 dln-gray-box p-3'>
                <div>{state.balances.tUSDC}</div>
                <div>tUSDC Balance</div>
              </div>

              <div className='col mb-1 dln-gray-box p-3 mx-1'>
                <div>{state.balances.aUSDC}</div>
                <div>aUSDC Balance</div>
              </div>

              <div className='col mb-1 dln-gray-box p-3 mx-1'>
                <div>{state.balances.tUSDT}</div>
                <div>tUSDT Balance</div>
              </div>

              <div className='col mb-1 dln-gray-box p-3 mx-1'>
                <div>{state.balances.aUSDT}</div>
                <div>aUSDT Balance</div>
              </div>

              <div className='col mb-1 dln-gray-box p-3 mx-1'>
                <div>{state.balances.DLN}</div>
                <div>DLN Balance</div>
              </div>

              <div className='col mb-1 dln-gray-box p-3 mx-1'>
                <div>{state.balances.DLNG}</div>
                <div>DLNG Balance</div>
              </div>
            </div>
            {/* Test Faucet section */}
            <div className='row mt-5 mx-5 justify-content-center'>
              <div className=''>
                <div className='col'>
                  <div className='dln-mint-title dln-txt-primary-color'>
                    DLN Test Faucet
                  </div>
                </div>
              </div>
            </div>
            <div className='dln-helperText mt-3'>
              <div>
                Request up to 1000 Test Tokens from the DLN Faucet, they have no
                value
              </div>
            </div>
            <div className='inputForm row mx-lg-5 mx-sm-0'>
              <div className='col-lg-5 col-sm-12 text-left dln-section-label'>
                <div className='dln-label-upper-text'>
                  Please send to my wallet
                </div>
                <a
                  className='dln-break-word'
                  target='_blank'
                  rel='noopener noreferrer'
                  href='#'
                >
                  {/* // {user.publicAddress} */}
                </a>
              </div>
              <div className='col-lg-5 col-sm-12'>
                <div className='inputWrapper row'>
                  <input
                    name='requestTokenValue'
                    className='dmmInput col-6'
                    value={state.inputs.requestTokenValue}
                    onChange={handleChange}
                    type='number'
                  />
                  <select
                    name='requestTokenAddress'
                    value={state.inputs.requestTokenAddress}
                    onChange={handleChange}
                    className='dmmInput col-6'
                  >
                    <option key='' value=''>
                      Select Token
                    </option>
                    <option key='tUSDC' value='tUSDC'>
                      tUSDC
                    </option>
                    <option key='tUSDT' value='tUSDT'>
                      tUSDT
                    </option>
                  </select>
                </div>
              </div>
              <div className='col-2'>
                <div className='submit'>
                  <button
                    type='button'
                    className='dln-submit-btn'
                    onClick={handleRequest}
                    disabled={
                      state.requestBtnClicked === true ||
                      state.inputs.requestTokenValue <= 0
                    }
                  >
                    Request
                  </button>
                </div>
              </div>
            </div>
            <div className='row justify-content-center'>
              <div className='col-4'>
                <hr className='dln-inner-page-seperation' />
              </div>
            </div>
            {/* end of Test Faucet section */}
            {/* mint section */}
            <div className='row mx-5 justify-content-center'>
              <div className=''>
                <div className='col'>
                  <div className='dln-mint-title dln-txt-primary-color'>
                    Mint
                  </div>
                </div>
              </div>
            </div>
            <div className='dln-helperText mt-3'>
              <div>
                Mint your assets into aTokens so it can participate in the DLN.
              </div>
            </div>
            <div className='inputForm row mx-lg-5 mx-sm-0'>
              <div className='col-lg-5 col-sm-12'>
                <div className='inputWrapper row mt-2'>
                  <input
                    name='mintTokenValue'
                    className='dmmInput col-6'
                    value={state.inputs.mintTokenValue}
                    onChange={handleChange}
                  />
                  <select
                    name='mintTokenAddress'
                    value={state.inputs.mintTokenAddress}
                    onChange={handleChange}
                    className='dmmInput col-6'
                  >
                    <option key='' value=''>
                      Select Token
                    </option>
                    <option key='tUSDC' value='tUSDC'>
                      tUSDC
                    </option>
                    <option key='tUSDT' value='tUSDT'>
                      tUSDT
                    </option>
                  </select>
                </div>
              </div>
              <div className='col-lg-2 col-sm-12'>
                <div className='arrow'>
                  <div className='rightArrow'>
                    <ArrowForward />
                  </div>
                  <div className='downArrow'>
                    <ArrowDownward />
                  </div>
                </div>
              </div>
              <div className='col-lg-3 col-sm-12'>
                {/* <input type='text' readOnly={true} /> */}
                <div className='dln-asset d-flex align-self-center pt-2'>
                  <span className='dln-txt-primary-color pr-1'>
                    {state.inputs.mintTokenValue}
                  </span>
                  {state.selectedMintTokenSymbol
                    ? "a" + state.selectedMintTokenSymbol
                    : ""}
                </div>
              </div>
              <div className='col-lg-2 col-sm-12'>
                <div className='submit mt-2'>
                  <button
                    className='dln-submit-btn'
                    onClick={handleMint}
                    disabled={
                      state.mintBtnClicked === true ||
                      state.inputs.mintTokenValue <= 0
                    }
                  >
                    Mint
                  </button>
                </div>
              </div>
            </div>
            {/* end of mint section */}
            <div className='row justify-content-center'>
              <div className='col-4'>
                <hr className='dln-inner-page-seperation' />
              </div>
            </div>
            {/* redeem section */}
            <div className='row mx-5 justify-content-center'>
              <div className=''>
                <div className='col'>
                  <div className='dln-mint-title dln-txt-primary-color'>
                    Redeem
                  </div>
                </div>
              </div>
            </div>
            <div className='dln-helperText mt-3'>
              <div>Redeem my DLN Assets.</div>
            </div>
            <div className='inputForm row mx-lg-5 mx-sm-0'>
              <div className='col-lg-5 col-sm-12'>
                <div className='dln-label-upper-text'>
                  Redeem the following Assets
                </div>
                <div className='inputWrapper row'>
                  <input
                    name='redeemTokenValue'
                    className='dmmInput col-6'
                    value={state.inputs.redeemTokenValue}
                    onChange={handleChange}
                  />
                  <select
                    name='redeemTokenAddress'
                    value={state.inputs.redeemTokenAddress}
                    onChange={handleChange}
                    className='dmmInput col-6'
                  >
                    <option key='' value=''>
                      Select Token
                    </option>
                    <option key='aUSDC' value='aUSDC'>
                      aUSDC
                    </option>
                    <option key='aUSDT' value='aUSDT'>
                      aUSDT
                    </option>
                  </select>
                </div>
              </div>
              <div className='col-lg-2 col-sm-12'>
                <div className='arrow'>
                  <div className='rightArrow'>
                    <ArrowForward />
                  </div>
                  <div className='downArrow'>
                    <ArrowDownward />
                  </div>
                </div>
              </div>
              <div className='col-lg-3 col-sm-12'>
                <div className='dmmSection w-100'>
                  {/* <input type='text' readOnly={true} /> */}

                  <div className='dln-asset  d-flex align-self-center pt-2'>
                    <span className='dln-txt-primary-color pr-1'>
                      {state.inputs.redeemTokenValue}
                    </span>
                    {state.selectedRedeemTokenSymbol
                      ? "t" + state.selectedRedeemTokenSymbol
                      : ""}
                  </div>
                </div>
              </div>
              <div className='col-lg-2 col-sm-12'>
                <div className='submit mt-2'>
                  <button
                    className='dln-submit-btn'
                    onClick={handleRedeem}
                    disabled={
                      state.redeemBtnClicked === true ||
                      state.inputs.redeemTokenValue <= 0
                    }
                  >
                    Redeem
                  </button>
                </div>
              </div>
            </div>
            {/* end of REDEEM section */}
            <div className='row justify-content-center'>
              <div className='col-4'>
                <hr className='dln-inner-page-seperation' />
              </div>
            </div>

            {/* Stack section */}
            <div className='row mx-5 justify-content-center'>
              <div className=''>
                <div className='col'>
                  <div className='dln-mint-title dln-txt-primary-color'>
                    Stake
                  </div>
                </div>
              </div>
            </div>
            <div className='dln-helperText mt-3'>
              <div>Stake my DLN Assets to get DLN rewards</div>
            </div>
            <div className='inputForm row mx-lg-5 mx-sm-0'>
              <div className='col-lg-5 col-sm-12 text-left dln-section-label'>
                Stake the following token:
              </div>
              <div className='col-lg-5 col-sm-12'>
                <div className='inputWrapper row'>
                  <input
                    className='dmmInput col-6'
                    name='stakeTokenValue'
                    value={state.inputs.stakeTokenValue}
                    onChange={handleChange}
                  />
                  <select
                    name='stakeTokenAddress'
                    value={state.inputs.stakeTokenAddress}
                    onChange={handleChange}
                    className='dmmInput col-6'
                  >
                    <option key='' value=''>
                      Select Token
                    </option>
                    <option key='aUSDC' value='aUSDC'>
                      aUSDC
                    </option>
                    <option key='aUSDT' value='aUSDT'>
                      aUSDT
                    </option>
                  </select>
                </div>
              </div>
              <div className='col-2'>
                <div className='submit'>
                  <button
                    className='dln-submit-btn'
                    disabled={
                      state.stakeBtnClicked === true ||
                      state.inputs.stakeTokenValue <= 0
                    }
                    onClick={handleStake}
                  >
                    Stake
                  </button>
                </div>
              </div>
            </div>
            <div className='row justify-content-center'>
              <div className='col-4'>
                <hr className='dln-inner-page-seperation' />
              </div>
            </div>

            {/* end of stake section */}
            {/* unStack section */}
            <div className='row mx-5 justify-content-center'>
              <div className=''>
                <div className='col'>
                  <div className='dln-mint-title dln-txt-primary-color'>
                    UnStake
                  </div>
                </div>
              </div>
            </div>
            <div className='dln-helperText mt-3'>
              <div>Unstake my staked DLN Assets</div>
            </div>
            <div className='inputForm row mx-lg-5 mx-sm-0'>
              <div className='col-lg-5 col-sm-12 text-left dln-section-label'>
                unStake the following token:
              </div>
              <div className='col-lg-5 col-sm-12'>
                <div className='inputWrapper row'>
                  <input
                    className='dmmInput col-6'
                    name='unStakeTokenValue'
                    value={state.inputs.unStakeTokenValue}
                    onChange={handleChange}
                  />
                  <select
                    name='unStakeTokenAddress'
                    value={state.inputs.unStakeTokenAddress}
                    onChange={handleChange}
                    className='dmmInput col-6'
                  >
                    <option key='' value=''>
                      Select Token
                    </option>
                    <option key='aUSDC' value='aUSDC'>
                      aUSDC
                    </option>
                    <option key='aUSDT' value='aUSDT'>
                      aUSDT
                    </option>
                  </select>
                </div>
              </div>
              <div className='col-2'>
                <div className='submit'>
                  <button
                    className='dln-submit-btn'
                    disabled={
                      state.unStakeBtnClicked === true ||
                      state.inputs.unStakeTokenValue <= 0
                    }
                    onClick={handleUnStake}
                  >
                    UnStake
                  </button>
                </div>
              </div>
            </div>
            <div className='row justify-content-center'>
              <div className='col-4'>
                <hr className='dln-inner-page-seperation' />
              </div>
            </div>

            {/* end of unstake section */}
            {/* back section */}
            <div className='row mx-5 justify-content-center'>
              <div className=''>
                <div className='col'>
                  <div className='dln-mint-title dln-txt-primary-color'>
                    Back
                  </div>
                </div>
              </div>
            </div>
            <div className='dln-helperText mt-3'>
              <div>Select a Proposal to Back and get DLN Rewards.</div>
            </div>
            <div className='inputForm row mx-lg-5 mx-sm-0'>
              <div className='col-lg-5 col-sm-12'>
                <div className='dln-label-upper-text'>Proposal to Back</div>
                <div className='inputWrapper'>
                  {/* {state.proposalsLoading && (
                    <div className='dln-section-spinner-container dln-select-spinner'>
                      <div className='dln-spinner-body pt-0 '>
                        <Spinner
                          className='mr-1 dln-page-spinner'
                          as='span'
                          animation='border'
                          role='status'
                          aria-hidden='true'
                        />
                      </div>
                    </div>
                  )} */}
                  <select
                    name='backProposal'
                    value={state.inputs.backProposal}
                    onChange={handleChange}
                    className={
                      state.inputs.backProposal ? "dmmInput pl-3" : "dmmInput"
                    }
                  >
                    <option>Select Proposal</option>
                    {state.proposals.map(({ description, id }) => (
                      <option key={id} value={id}>
                        {description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className='col-lg-5 col-sm-12'>
                <div className='dln-label-upper-text'>&nbsp;</div>

                <div className='inputWrapper row'>
                  <input
                    className='dmmInput col-6'
                    name='backTokenValue'
                    value={state.inputs.backTokenValue}
                    onChange={handleChange}
                  />
                  <select
                    name='backTokenAddress'
                    value={state.inputs.backTokenAddress}
                    onChange={handleChange}
                    className='dmmInput col-6'
                  >
                    <option key='' value=''>
                      Select Token
                    </option>
                    <option key='aUSDC' value='aUSDC'>
                      aUSDC
                    </option>
                    <option key='aUSDT' value='aUSDT'>
                      aUSDT
                    </option>
                  </select>
                </div>
              </div>
              <div className='col-lg-2 col-sm-12'>
                <div className='submit mt-2'>
                  <button
                    onClick={handleBacking}
                    className='dln-submit-btn'
                    disabled={
                      state.backBtnClicked === true ||
                      state.inputs.backTokenValue <= 0
                    }
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>

            {/* end of back section */}
            <div className='row justify-content-center'>
              <div className='col-4'>
                <hr className='dln-inner-page-seperation' />
              </div>
            </div>

            {/* unback section */}
            <div className='row mx-5 justify-content-center'>
              <div className=''>
                <div className='col'>
                  <div className='dln-mint-title dln-txt-primary-color'>
                    UnBack
                  </div>
                </div>
              </div>
            </div>
            <div className='dln-helperText mt-3'>
              <div>UnBack my backed DLN Assets</div>
            </div>
            <div className='inputForm row mx-lg-5 mx-sm-0'>
              <div className='col-lg-5 col-sm-12'>
                <div className='dln-label-upper-text'>Proposal to UnBack</div>
                <div className='inputWrapper'>
                  {/* {state.proposalsLoading && (
                    <div className='dln-section-spinner-container  dln-select-spinner'>
                      <div className='dln-spinner-body pt-0 '>
                        <Spinner
                          className='mr-1 dln-page-spinner'
                          as='span'
                          animation='border'
                          role='status'
                          aria-hidden='true'
                        />
                      </div>
                    </div>
                  )} */}
                  <select
                    name='unBackProposal'
                    value={state.inputs.unBackProposal}
                    onChange={handleChange}
                    className='dmmInput'
                  >
                    <option>Select Proposal</option>
                    {state.proposals.map(({ description, id }) => (
                      <option key={id} value={id}>
                        {description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className='col-lg-5 col-sm-12'>
                <div className='dln-label-upper-text'>&nbsp;</div>

                <div className='inputWrapper row'>
                  <input
                    className='dmmInput col-6'
                    name='unbackTokenValue'
                    value={state.inputs.unbackTokenValue}
                    onChange={handleChange}
                  />
                  <select
                    name='unbackTokenAddress'
                    value={state.inputs.unbackTokenAddress}
                    onChange={handleChange}
                    className='dmmInput col-6'
                  >
                    <option key='' value=''>
                      Select Token
                    </option>
                    <option key='aUSDC' value='aUSDC'>
                      aUSDC
                    </option>
                    <option key='aUSDT' value='aUSDT'>
                      aUSDT
                    </option>
                  </select>
                </div>
              </div>
              <div className='col-lg-2 col-sm-12'>
                <div className='submit mt-2'>
                  <button
                    onClick={handleUnBacking}
                    className='dln-submit-btn'
                    disabled={
                      state.unbackBtnClicked === true ||
                      state.inputs.unbackTokenValue <= 0
                    }
                  >
                    UnBack
                  </button>
                </div>
              </div>
            </div>

            {/* end of unback section */}
            <div className='row justify-content-center'>
              <div className='col-4'>
                <hr className='dln-inner-page-seperation' />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export { CasperAssets };
