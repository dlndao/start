import React from "react";
import { Switch } from "react-router-dom";
import RouteWrapper from "./Route";
import { Route } from "react-router-dom";
import AlertTemplate from "react-alert-template-basic";
import { positions, Provider, types } from "react-alert";

import Start from "pages/start";
import Register from "pages/UserManagement/register";
import Home from "pages/HomeTabs/home";
import Borrow from "pages/HomeTabs/borrow";
import Invest from "pages/HomeTabs/invest";
import AppLogin from "pages/UserManagement/login";
import Profile from "pages/UserManagement/profile";
import MfiProposals from "pages/MfiProposals";
import ResetPassword from "pages/UserManagement/resetPassword";
import ForgotPassword from "pages/UserManagement/forgotPassword";
import VerifyCode from "pages/UserManagement/verifyCode";
import SingleProposalPage from "pages/Proposals/singleProposalPage";
import Campaigns from "pages/Campaigns/campaigns";
import CampaignProposals from "pages/Campaigns/campaignProposals";
import { CasperAssets } from "pages/CasperAssets";

function Routes() {
  const options = {
    timeout: 5000,
    position: positions.TOP_RIGHT,
    type: types.ERROR,
  };

  return (
    <Provider template={AlertTemplate} {...options}>
      <Switch>
        <Route exact path='/' component={Start} />
        <Route path='/start' component={Start} />

        <RouteWrapper
          path='/CasperAssets'
          isAdmin={false}
          component={(props) => <CasperAssets {...props} />}
        />
        <RouteWrapper
          path='/App/Start/:mfi?'
          isAdmin={false}
          component={(props) => <Start {...props} />}
          isApp={true}
          isStart={true}
        />
        <RouteWrapper
          path='/App/Register/:mfi?'
          isAdmin={false}
          component={(props) => <Register {...props} />}
          isApp={true}
          isStart={true}
        />
        <RouteWrapper
          path='/App/Home/:mfi?'
          isAdmin={false}
          component={(props) => <Home {...props} />}
          isApp={true}
        />
        <RouteWrapper
          path='/App/Campaigns/:mfi?'
          isAdmin={false}
          component={(props) => <Campaigns {...props} />}
          isApp={true}
        />
        <RouteWrapper
          path='/App/Borrow/:mfi?'
          isAdmin={false}
          component={(props) => <Borrow {...props} />}
          isApp={true}
        />
        <RouteWrapper
          path='/App/Invest/:mfi?'
          isAdmin={false}
          component={(props) => <Invest {...props} />}
          isApp={true}
        />
        <RouteWrapper
          path='/App/Login/:mfi?'
          isAdmin={false}
          component={(props) => <AppLogin {...props} />}
          isApp={true}
          isStart={true}
        />
        <RouteWrapper
          path='/App/Profile/:mfi?'
          isAdmin={false}
          component={(props) => <Profile {...props} />}
          isApp={true}
        />
        <RouteWrapper
          path='/App/MFIProposals/:mfi?'
          isAdmin={false}
          component={(props) => <MfiProposals {...props} />}
          isApp={true}
        />
        <RouteWrapper
          path='/App/ResetPassword/:mfi?'
          isAdmin={false}
          component={(props) => <ResetPassword {...props} />}
          isApp={true}
          isStart={true}
        />
        <RouteWrapper
          path='/App/ForgotPassword/:mfi?'
          isAdmin={false}
          component={(props) => <ForgotPassword {...props} />}
          isApp={true}
          isStart={true}
        />
        <RouteWrapper
          path='/App/VerifyCode/:mfi?/:phoneNumber?'
          isAdmin={false}
          component={(props) => <VerifyCode {...props} />}
          isApp={true}
          isStart={true}
        />
        <RouteWrapper
          path='/App/proposal'
          isAdmin={false}
          component={(props) => <SingleProposalPage {...props} />}
          isApp={true}
          isStart={true}
        />
        <RouteWrapper
          path='/App/proposalsByCampaign/:mfi?/:id?'
          isAdmin={false}
          component={(props) => <CampaignProposals {...props} />}
          isApp={true}
          isStart={true}
        />
      </Switch>
    </Provider>
  );
}

export { Routes };
