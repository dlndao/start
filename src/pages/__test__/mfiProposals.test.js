import React from "react";
import {render}  from "react-dom";
import {BrowserRouter}  from "react-router-dom";
import MfiProposals from "pages/MfiProposals";


it("renders without crashing",()=>{
    const div=document.createElement("div");
    render(<BrowserRouter><MfiProposals/></BrowserRouter>,div)
})