import React from "react";
import {render}  from "react-dom";
import {BrowserRouter}  from "react-router-dom";
import VerifyCode from "../verifyCode";

it("renders without crashing",()=>{
    const div=document.createElement("div");
    render(<BrowserRouter><VerifyCode/></BrowserRouter>,div)
})