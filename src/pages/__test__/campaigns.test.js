import React from "react";
import {render}  from "react-dom";
import {BrowserRouter}  from "react-router-dom";
import CampaignProposals from "pages/Campaigns/campaignProposals";


it("renders without crashing",()=>{
    const div=document.createElement("div");
    render(<BrowserRouter><CampaignProposals/></BrowserRouter>,div)
})